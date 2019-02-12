package com.attendU.dev.microservices.user;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.attendU.dev.microservices.bean.TokenBean;
import com.attendU.dev.microservices.bean.User;

@Mapper
public interface UserMapper {
	public int registerUser(User user);

	public List<Map<String, Object>> getUsers();

	public User getUserbyId(long id);

	public User getUserbyName(String username);

	public TokenBean getAuth(long uid);

	public int insertToken(TokenBean token);

	public int removeToken(long uid);

	public List<User> getName(List<Long> users);
}
