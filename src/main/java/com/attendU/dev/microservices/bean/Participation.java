package com.attendU.dev.microservices.bean;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

public class Participation implements Serializable{
	@Getter@Setter
	private Long rid;

	@Getter@Setter
	private Long aid;

	@Getter@Setter
	private Long uid;

	@Getter@Setter
	private Integer Attendance;

	@Getter@Setter
	private String absentReason;
}
