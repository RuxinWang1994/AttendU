package com.attendU.dev.microservices.user;

import java.util.Date;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.attendU.dev.microservices.bean.Room;
import com.attendU.dev.microservices.bean.TokenBean;
import com.attendU.dev.microservices.bean.User;
import com.attendU.dev.microservices.room.RoomMapper;

/**
 * A non-reachable service for internal usage
 *
 * This service will help contact with db about user information
 *
 * @author Qinzhe Zhang (qinzhez@gmail.com)
 *
 */
public class AuthenticationService {
	private UserMapper userMapper;
	private RoomMapper roomMapper;
	private SqlSession sqlSession;
	private static String SECRET = "";

	public AuthenticationService(UserMapper mapper, SqlSession session) {
		userMapper = mapper;
		sqlSession = session;
	}

	/**
	 * Login a user, check the username and password, valid the token.
	 *
	 * @param username
	 * @param password
	 * @return result of login or not
	 */
	public Token login(String username, String password) {
		Token token = get(username, password);
		if (token == null)
			return null;

		if (!validToken(token))
			return null;

		return token;

	}
	
	/**
	 * Get token from db by using username and password
	 *
	 * @param username
	 * @param password
	 * @return valid token object or null
	 */
	private Token get(String username, String password) {
		User userInfo = null;
		Token ret = null;
		try {
			userInfo = userMapper.getUserbyName(username);
		} catch (Exception e) {
			return ret;
		}

		if (!userInfo.getPassword().equals(password))
			return null;

		TokenBean tokenBean = null;
		try {
			tokenBean = userMapper.getAuth((long) userInfo.getUid());
		} catch (Exception e) {
			tokenBean = null;
		}

		if (tokenBean == null) {
			ret = new Token(SECRET, (long) userInfo.getUid());
			tokenBean = new TokenBean();
			tokenBean.setUid(ret.getUid());
			tokenBean.setToken(ret.getToken());
			tokenBean.setCreateTime(ret.getCreateTime());
			tokenBean.setExpiration(ret.getExpiration());
			try {
				userMapper.insertToken(tokenBean);
			} catch (Exception e) {
				System.out.println(e.getMessage());
				sqlSession.rollback();
				return null;
			}
		} else {
			ret = new Token(SECRET, tokenBean.getUid());
			try {
				userMapper.removeToken(tokenBean.getUid());
				tokenBean.setUid(ret.getUid());
				tokenBean.setToken(ret.getToken());
				tokenBean.setCreateTime(ret.getCreateTime());
				tokenBean.setExpiration(ret.getExpiration());
				userMapper.insertToken(tokenBean);
			} catch (Exception e) {
				sqlSession.rollback();
				return null;
			}
		}
		sqlSession.commit();
		return ret;
	}

	/**
	 * Valid a token object is valid comparing with db record
	 *
	 * @param token
	 * @return true if valid
	 */
	public boolean validToken(Token token) {
		if (token == null)
			return false;

		TokenBean tokenBean = null;
		try {
			tokenBean = userMapper.getAuth(token.getUid());
		} catch (Exception e) {
		}

		if (tokenBean == null)
			return false;

		if (!tokenBean.getToken().equals(token.getToken()))
			return false;

		if (!tokenBean.getExpiration().after(new Date()))
			return false;
		return true;
	}

	/**
	 * Valid a token with specific uid with db record
	 *
	 * @param uid
	 * @param token
	 * @return token if valid; otherwise, null
	 */
	public Token validToken(Long uid, String token) {
		if (token == null || uid == null)
			return null;

		TokenBean tokenBean = userMapper.getAuth(uid);

		if (tokenBean == null)
			return null;

		if (!tokenBean.getToken().equals(token))
			return null;

		if (!tokenBean.getExpiration().after(new Date()))
			return null;
		return new Token(tokenBean);
	}
}
