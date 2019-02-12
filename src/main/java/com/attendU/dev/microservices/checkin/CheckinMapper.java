package com.attendU.dev.microservices.checkin;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.attendU.dev.microservices.bean.Checkin;


@Mapper
public interface CheckinMapper {

	public Integer absent(@Param("uid") Long uid, @Param("rid") Long rid,
							@Param("aid") Long aid, @Param("reason") String absentReason, @Param("createTime") Date date);


	public Integer checkin(Checkin checkin);

	public List<Checkin> getCheckinInfo(@Param("uid") Long uid, @Param("rid") Long rid, @Param("aid") Long aid);

	public List<Checkin> getCheckinByRoom(@Param("uid") Long uid, @Param("rid") Long rid);

	public Date getDue(Long aid);

}
