package com.attendU.dev;

import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class DevApplication {

	static Logger log = Logger.getLogger(DevApplication.class.getName());

	public static void main(String[] args) throws Exception {

		log.info("Start");
		log.debug("Debug info");
		SpringApplication.run(DevApplication.class, args);
	}
}
