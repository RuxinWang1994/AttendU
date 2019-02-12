package com.attendU.dev.microservices.bean;

import lombok.Getter;
import lombok.Setter;

public class Room{

	@Getter@Setter
	private Long rid;

	@Getter@Setter
	private String name;
	@Getter@Setter
	private Long rcid; //RoomConfig id
	@Getter@Setter
	private Integer participationNum;
	@Getter@Setter
	private Long adminId;
	@Getter@Setter
	String description;
	
}