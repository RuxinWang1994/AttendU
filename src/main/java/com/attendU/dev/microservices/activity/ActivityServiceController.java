package com.attendU.dev.microservices.activity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.attendU.dev.microservices.bean.Activity;
import com.attendU.dev.microservices.bean.Participation;
import com.attendU.dev.microservices.bean.Room;
import com.attendU.dev.microservices.bean.TokenBean;
import com.attendU.dev.mybatis.MyBatisConnectionFactory;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "*")
public class ActivityServiceController {

	static private Logger log = Logger.getLogger(ActivityServiceController.class.getName());

	@Autowired
	private RestTemplate restTemplate;

	private static ActivityMapper activityMapper;
	private static SqlSession sqlSession;

	public ActivityServiceController() {
		sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
		activityMapper = sqlSession.getMapper(ActivityMapper.class);
	}

	@RequestMapping(value = "/isAdmin/{uid}/{rid}", method = RequestMethod.GET)
	public ResponseEntity<Boolean> isAdmin(@PathVariable Long uid, @PathVariable Long rid) {
		Boolean isAdmin = activityMapper.isAdmin(uid, rid);
		if (isAdmin == null || !isAdmin.booleanValue())
			return new ResponseEntity<Boolean>(isAdmin, HttpStatus.BAD_REQUEST);
		return new ResponseEntity<Boolean>(isAdmin, HttpStatus.OK);

	}

	@RequestMapping(value = "/getActivity/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<Activity>> getActivityById(@PathVariable String id) {
		List<Activity> activity = null;
		try {
			activity = activityMapper.getActivityById(Long.parseLong(id));
			if (activity == null)
				return new ResponseEntity<List<Activity>>(activity, HttpStatus.BAD_REQUEST);
			return new ResponseEntity<List<Activity>>(activity, HttpStatus.OK);
		} catch (Exception e) {
			sqlSession.close();
			sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
			activityMapper = sqlSession.getMapper(ActivityMapper.class);
			return new ResponseEntity<List<Activity>>(activity, HttpStatus.BAD_REQUEST);
		}

	}

	@RequestMapping(value = "/getRoom/{id}", method = RequestMethod.GET)
	public ResponseEntity<Room> getRoomByAid(@PathVariable String id) {
		Room room = null;
		try {
			room = activityMapper.getRoombyAid(Long.parseLong(id));
			if (room == null)
				return new ResponseEntity<Room>(room, HttpStatus.BAD_REQUEST);
			return new ResponseEntity<Room>(room, HttpStatus.OK);
		} catch (Exception e) {
			sqlSession.close();
			sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
			activityMapper = sqlSession.getMapper(ActivityMapper.class);
			return new ResponseEntity<Room>(room, HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(value = "/getRoom/rid/{rid}", method = RequestMethod.GET)
	public ResponseEntity<Room> getRoomByRid(@PathVariable String rid) {
		Room room = activityMapper.getRoombyRid(Long.parseLong(rid));
		if (room == null)
			return new ResponseEntity<Room>(room, HttpStatus.BAD_REQUEST);
		return new ResponseEntity<Room>(room, HttpStatus.OK);

	}

	@RequestMapping(value = "/activityname/{name}", method = RequestMethod.GET)
	public @ResponseBody List<Activity> getActivityByName(@PathVariable String name) {
		return activityMapper.getActivitybyName(name);
	}

	@RequestMapping(value = "/getActivityList/{rid}", method = RequestMethod.GET)
	public @ResponseBody List<Activity> getActivityByRoom(@PathVariable long rid) {
		try {
			List<Activity> res = activityMapper.getActivityByRoom(rid, (new Date()));
			return res;
		} catch (Exception e) {
			log.error(e);
			return null;
		}
	}

	@RequestMapping(value = "/getParticipation/{rid}/{uid}", method = RequestMethod.GET)
	public @ResponseBody List<Participation> getParticipationByRoom(@PathVariable long rid, @PathVariable long uid) {
		try {
			List<Participation> res = activityMapper.getParticipationByRoom(uid, rid);
			sqlSession.close();
			sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
			activityMapper = sqlSession.getMapper(ActivityMapper.class);
			return res;
		} catch (Exception e) {
			log.error(e);
			return null;
		}
	}

	@RequestMapping(value = "/createActivity/{uid}/{rid}", method = RequestMethod.POST) // delete @PathVariable Long
																						// uid, @PathVariable Long rid
	public ResponseEntity<Boolean> createActivity(@PathVariable Long uid, @PathVariable Long rid,
			@RequestBody Activity reg) {
		boolean check = true;
		if (reg != null && uid != null && uid > 0 && rid != null && rid > 0) {
			if (reg.getName() == null || reg.getDate() == null)
				check = false;
		} else
			check = false;

		if (check) {
			try {
				check = false;
				int ret = activityMapper.createActivity(reg);
				reg.setAid(activityMapper.getCreatedAID().longValue());
				activityMapper.updateParticipation_activity(uid, rid, reg.getAid());
				if(activityMapper.checkPartRoom(uid, rid)<1)
					activityMapper.fixPartRoom(uid, rid);
				activityMapper.updateRALink(rid, reg.getAid());
				sqlSession.commit();
				check = (ret == 1) ? true : false;
			} catch (Exception e) {
				sqlSession.rollback();
				log.error(e);
				check = false;
			}
		}
		if (check)
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}

	@RequestMapping(value = "/removeActivity", method = RequestMethod.POST)
	public ResponseEntity<Boolean> removeActivity(@RequestBody Activity activity) {
		int deleted = 0;
		Boolean pass = false;
		TokenBean tmp = new TokenBean();
		tmp.setUid(activity.getAcid());
		tmp.setToken(activity.getName());
		try {
			RestTemplate rest = new RestTemplate();
			List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();
			MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
			MediaType[] array = { MediaType.APPLICATION_JSON };
			converter.setSupportedMediaTypes(Arrays.asList(array));
			messageConverters.add(converter);
			rest.setMessageConverters(messageConverters);
			pass = rest.postForObject("http://localhost:8004/user/validToken", tmp, Boolean.class);

			if (activity.getAid() != null && activity.getAid() > 0 && pass.booleanValue())
				deleted = activityMapper.removeActivity(activity.getAid());
			sqlSession.commit();
			if (deleted == 1)
				return new ResponseEntity<Boolean>(true, HttpStatus.OK);
			else
				return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

	}

	@RequestMapping(value = "/updateParticipation", method = RequestMethod.POST)
	public ResponseEntity<Boolean> updateParticipation_activity(@RequestBody Participation part) {

		try{
			int updated = activityMapper.updateParticipation_activity(part.getUid(),part.getRid(),part.getAid());
			if(activityMapper.checkPartRoom(part.getUid(), part.getRid())<1)
				activityMapper.fixPartRoom(part.getUid(), part.getRid());
			sqlSession.commit();
			if (updated == 1)
				return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (Exception e){
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}

	@RequestMapping(value = "/removeParticipation", method = RequestMethod.POST)
	public ResponseEntity<Boolean> removeParticipation_activity(@RequestBody Participation part) {

		try{
			int deleted = activityMapper.removeParticipation_activity(part.getUid(),part.getRid(),part.getAid());
			sqlSession.commit();
			if (deleted == 1)
				return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (Exception e){
			log.error(e);
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}



	@RequestMapping(value = "/updateActivity", method = RequestMethod.POST)
	public ResponseEntity<Boolean> updateActivity(@RequestBody Activity activity) {
		try {
			int updated = activityMapper.updateActivity(activity);
			sqlSession.commit();
			if (updated == 1)
				return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}

	@RequestMapping(value = "/startActivity/{aid}", method = RequestMethod.POST)
	public ResponseEntity<Boolean> startActivity(@PathVariable Long aid) {
		try {
			activityMapper.startActivity(aid);
			sqlSession.commit();
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}
	}

	@RequestMapping(value = "/endActivity/{aid}", method = RequestMethod.POST)
	public ResponseEntity<Boolean> endActivity(@PathVariable Long aid) {
		try {
			activityMapper.endActivity(aid);
			sqlSession.commit();
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

	}

	@RequestMapping(value = "/getRecent/{uid}", method = RequestMethod.GET)
	public @ResponseBody List<Activity> getRecent(@PathVariable long uid) {
		try {
			List<Activity> res = activityMapper.getAdminRecent(uid);

			sqlSession.close();
			sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
			activityMapper = sqlSession.getMapper(ActivityMapper.class);
			return res;
		} catch (Exception e) {
			log.error(e);
			return null;
		}
	}

	@RequestMapping(value = "/participation/{aid}", method = RequestMethod.GET)
	public @ResponseBody List<Participation> getActivityParticipation(@PathVariable long aid) {
		try {
			List<Participation> res = activityMapper.getActivityParticipation(aid);
			return res;
		} catch (Exception e) {
			log.error(e);
			return null;
		}
	}
}
