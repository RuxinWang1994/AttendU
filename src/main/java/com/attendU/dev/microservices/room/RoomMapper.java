package com.attendU.dev.microservices.room;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.attendU.dev.microservices.bean.Room;

@Mapper
public interface RoomMapper {

	public Integer createRoom(Room room);

	public Integer removeRoom(Long rid);

	public Integer updateRoom(Room room);

	public Room getRoomById(Long rid);

	public Room getRoombyName(String name);

	public List<Room> getRoomByUid(Long uid);

	public List<Room> getRoomByAdmin(Long adminId);

	public List<Room> searchRoom(Long rid);

	public Long getCreatedRID();

	public Integer updateParticipation(@Param("uid") Long uid, @Param("rid") Long rid);

	public Integer updateAdmin(@Param("uid") Long uid, @Param("rid") Long rid);

	public Integer quitRoom(@Param("uid") Long uid, @Param("rid") Long rid);

	public List<Long> getActivityByRid(Long rid);

	public Integer removeActivities(List<Long> aids);

	public Integer removeRoomLinking(Long rid);

}

