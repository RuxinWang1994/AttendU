package com.attendU.dev.microservices.bean;

import lombok.Getter;
import lombok.Setter;

public class RoomConfig{
	@Getter@Setter
	private Long id;
	@Getter@Setter
	private Integer participationNum;
	@Getter@Setter
	private Long Rcid;
	
	
	//@Getter
	//private Long sid; // scenario id
	//@Getter@Setter
	//private Boolean anonymous;
}