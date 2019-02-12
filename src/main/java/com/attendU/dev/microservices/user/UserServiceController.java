package com.attendU.dev.microservices.user;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.attendU.dev.microservices.bean.TokenBean;
import com.attendU.dev.microservices.bean.User;
import com.attendU.dev.mybatis.MyBatisConnectionFactory;

@RestController
@CrossOrigin(origins = "*")
public class UserServiceController {

	static private Logger log = Logger.getLogger(UserServiceController.class.getName());

	@Autowired
	private RestTemplate restTemplate;

	private UserMapper userMapper;
	private SqlSession sqlSession;
	private AuthenticationService auth;

	public UserServiceController() {
		sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession();
		userMapper = sqlSession.getMapper(UserMapper.class);
		auth = new AuthenticationService(userMapper, sqlSession);
	}

	@RequestMapping(value = "/user/id/{id}", method = RequestMethod.GET)
	public ResponseEntity<User> getUser(@PathVariable String id, @RequestParam Map<String, String> param) {
		User user = null;
		try{
			user = userMapper.getUserbyId(Long.parseLong(id));
			if(auth.validToken(Long.parseLong(id), param.get("token")) == null) {
				user = new User();
				user.setUid((long) -1);
				return new ResponseEntity<User>(user, HttpStatus.OK);
			}
			if(user == null)
				throw new Exception();
		}catch (Exception e) {
			user = new User();
			user.setUid((long) -1);
		}

		user.setPassword(null);
		user.setUsername(null);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@RequestMapping(value = "/user/username/{username}", method = RequestMethod.GET)
	public ResponseEntity<Boolean> getUserByName(@PathVariable String username) {
		User user = userMapper.getUserbyName(username);
		if (user == null)
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}

	@RequestMapping(value = "/user/registration", method = RequestMethod.POST)
	public ResponseEntity<Boolean> registration(@RequestBody User reg) {
		boolean check = true;
		if (reg != null) {
			if (reg.getFirstName() == null || reg.getFirstName().length() < 2)
				check = false;
			if (reg.getLastName() == null || reg.getLastName().length() < 2)
				check = false;
			if (reg.getEmailAddress() == null || !validEmail(reg.getEmailAddress()))
				check = false;
		} else
			check = false;

		// Update into db
		if (check) {
			try {
				int ret = userMapper.registerUser(reg);
				check = (ret == 1) ? true : false;
				sqlSession.commit();
			} catch (Exception e) {
				sqlSession.rollback();
				log.error(e);
			}
		}
		if (check)
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}

	@RequestMapping(value = "/user/login", method = RequestMethod.POST)
	public ResponseEntity<Token> login(@RequestBody User user) {
		Token token = auth.login(user.getUsername(), user.getPassword());
		if (token == null)
			return new ResponseEntity<Token>(new Token(), HttpStatus.OK);
		else {
			return new ResponseEntity<Token>(token, HttpStatus.OK);
		}
	}

	@RequestMapping(value = "/user/validToken", method = RequestMethod.POST)
	public ResponseEntity<Boolean> validToken(@RequestBody TokenBean token) {
		Token ret = auth.validToken(token.getUid(), token.getToken());
		if (ret == null)
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);

	}

	private boolean validEmail(String email) {
		if (email == null)
			return false;
		if (!email.contains("@"))
			return false;
		email = email.substring(email.indexOf('@'));
		if (!email.contains("."))
			return false;

		return true;
	}

	@RequestMapping(value = "/user/getName/{users}", method = RequestMethod.GET)
	public ResponseEntity<List<User>> getUserByName(@PathVariable List<Long> users) {
		List<User> user = userMapper.getName(users);
		if (user == null)
			return new ResponseEntity<List<User>>(user, HttpStatus.OK);
		return new ResponseEntity<List<User>>(user, HttpStatus.OK);
	}
}
