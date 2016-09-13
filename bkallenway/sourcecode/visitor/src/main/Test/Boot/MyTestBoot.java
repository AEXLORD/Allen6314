package Boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Created by teddyzhu on 10/29/15.
 */

@EnableAutoConfiguration
@ComponentScan(basePackages = { "com.allenway.*" })
@EntityScan(basePackages = { "com.allenway.*" })
@EnableJpaRepositories(basePackages = { "com.allenway.*" })
public class MyTestBoot {
	public static void main(String[] args) throws Exception {
		SpringApplication.run(MyTestBoot.class, args);
	}
}
