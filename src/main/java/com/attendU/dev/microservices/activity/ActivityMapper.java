package com.attendU.dev.microservices.activity;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.attendU.dev.microservices.bean.Activity;
import com.attendU.dev.microservices.bean.Participation;
import com.attendU.dev.microservices.bean.Room;

@Mapper
public interface ActivityMapper {

    public Integer createActivity(Activity activity);

	public Integer removeActivity(Long aid);

	public Integer updateActivity(Activity activity);

	public List<Activity> getActivityById(Long aid);

	public List<Activity> getActivitybyName(String name);

	public List<Map<String, Object>> getActivityByConfigId(Long acid);

	public List<Activity> getActivityByRoom(@Param("rid") Long rid, @Param("date") Date date);

	public Integer updateParticipation_activity(@Param("uid") Long uid, @Param("rid") Long rid, @Param("aid") Long aid);

	public Integer removeParticipation_activity(@Param("uid") Long uid, @Param("rid") Long rid, @Param("aid") Long aid);

	public Integer updateRALink(@Param("rid") Long rid, @Param("aid") Long aid);

	public Integer getCreatedAID();

	public Integer startActivity(Long aid);

	public Integer endActivity(Long aid);

	public Room	getRoombyAid(Long aid);

	public Room	getRoombyRid(Long aid);

	public List<Participation> getParticipationByRoom(@Param("uid") Long uid, @Param("rid") Long rid);

	public Boolean isAdmin(@Param("uid") Long uid, @Param("rid") Long rid);

	public List<Activity> getRecent(Long uid);

	public List<Activity> getAdminRecent(Long uid);

	public List<Participation> getActivityParticipation(Long aid);

	public Integer fixPartRoom(@Param("uid") Long uid, @Param("rid") Long rid);

	public Integer checkPartRoom(@Param("uid") Long uid, @Param("rid") Long rid);

}

