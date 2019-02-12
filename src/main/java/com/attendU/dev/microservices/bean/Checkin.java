package com.attendU.dev.microservices.bean;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

public class Checkin implements Serializable{
	
	@Getter@Setter
	private Long rid;
	
	@Getter@Setter
	private Long aid;
	
	@Getter@Setter
	private Long uid;
	
	@Getter@Setter
	private Integer Attendance;
	
	@Getter@Setter
	private Date createTime;
}