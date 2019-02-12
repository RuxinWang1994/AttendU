package com.attendU.dev.microservices.user;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.attendU.dev.microservices.bean.TokenBean;

import lombok.Getter;

/**
 * Token bean object but containing more features and tools
 *
 * @author Qinzhe Zhang (qinzhez@gmail.com)
 *
 */
public class Token {
	@Getter
	private long uid;
	@Getter
	private String token;

	@Getter
	private Date createTime;
	@Getter
	private Date expiration;

	public Token() {
		uid = -1;
		token = null;
		createTime = null;
		expiration = null;
	}

	/**
	 * Token constructor
	 *
	 * It will use secret argument and uid argument to generate a new token The new
	 * token can be saved into db, and pass to user
	 *
	 * @param sec
	 * @param id
	 */
	public Token(String sec, long id) {
		uid = id;
		createTime = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(createTime);
		calendar.add(Calendar.DAY_OF_MONTH, 1);
		expiration = calendar.getTime();
		token = tokenGenerate(sec, Long.toString(createTime.getTime()), Long.toString(uid));
	}

	/**
	 * A constructor can translate db token bean into rich-functioning token
	 *
	 * @param sec
	 * @param tokenBean
	 */
	public Token(TokenBean tokenBean) {
		uid = tokenBean.getUid();
		token = tokenBean.getToken();
		createTime = tokenBean.getCreateTime();
		expiration = tokenBean.getExpiration();
	}

	/**
	 * Token generation
	 *
	 * @param time
	 * @param uid
	 * @return
	 */
	private String tokenGenerate(String sec, String time, String uid) {
		String token = time + sec + uid;
		String tokenMd5 = "";
		try {
			MessageDigest md = MessageDigest.getInstance("md5");
			byte[] md5 = md.digest(token.getBytes());
			Encoder base = Base64.getEncoder();
			tokenMd5 = base.encodeToString(md5);

		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		return tokenMd5;
	}

	/**
	 * Token data translate
	 *
	 * It is convenient for data transmission over network
	 *
	 * @return
	 */
	public Map<String, String> toMap() {
		HashMap<String, String> res = new HashMap<>();
		res.put("uid", Long.toString(uid));
		res.put("token", token);
		res.put("expiration", expiration.toString());

		return res;
	}
}
