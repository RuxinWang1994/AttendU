package com.attendU.dev.microservices.bean;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

public class User implements Serializable{

	@Getter@Setter
	private Long uid;

	@Getter@Setter
	private String FirstName;
	@Getter@Setter
	private String MiddleName;
	@Getter@Setter
	private String LastName;
	@Getter@Setter
	private String Username;
	@Getter@Setter
	private String Password;
	@Getter@Setter
	private String EmailAddress;
	@Getter@Setter
	private String CellPhone;
}
