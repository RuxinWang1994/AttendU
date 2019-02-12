package com.attendU.dev.microservices.bean;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

public class TokenBean {
	@Getter@Setter
	private long uid;
	@Getter@Setter
	private String token;
	@Getter@Setter
	private Date createTime;
	@Getter@Setter
	private Date expiration;
}
