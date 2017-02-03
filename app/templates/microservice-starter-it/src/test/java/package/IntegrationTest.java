package <%= packageName %>.it;

import <%= packageName %>.*;
import com.netflix.loadbalancer.BaseLoadBalancer;
import com.netflix.loadbalancer.ILoadBalancer;
import com.netflix.loadbalancer.Server;
import okhttp3.mockwebserver.Dispatcher;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import okio.Buffer;
import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@ActiveProfiles("e2e")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Application.class)
public class IntegrationTest {

    @Autowired
    ILoadBalancer loadBalancer;

    @Autowired
    WebApplicationContext context;

    @Autowired
    TestRestTemplate rest;

    MockMvc mockMvc;
    MockWebServer mockWebServer;

    @Before
    public void setup() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        mockWebServer = new MockWebServer();

        // Read mock data
        String mock1 = IOUtils.toString(new ClassPathResource("mock1.json").getInputStream(), Charset.defaultCharset());

        final Dispatcher dispatcher = new Dispatcher() {
            @Override
            public MockResponse dispatch(RecordedRequest request) throws InterruptedException {
                if (request.getPath().equals("/service1/method1")) {
                    return new MockResponse().setBody(mock1).setHeader("Content-Type", "application/hal+json; charset=utf-8");
                } else if (request.getPath().equals("/service1/method2")) {
                    return new MockResponse().setBody(mock1).setHeader("Content-Type", "application/hal+json; charset=utf-8");
                } else if (request.getPath().equals("/service2/method1")) {
                    return new MockResponse().setBody(mock1).setHeader("Content-Type", "application/hal+json; charset=utf-8");
                } else {
                    return new MockResponse().setResponseCode(404);
                }
            }
        };
        mockWebServer.setDispatcher(dispatcher);
        mockWebServer.start();

        BaseLoadBalancer baseLoadBalancer = (BaseLoadBalancer) loadBalancer;
        baseLoadBalancer.setServersList(Arrays.asList(new Server(mockWebServer.getHostName(), mockWebServer.getPort())));
    }

    @After
    public void tearDown() throws Exception {
        mockWebServer.shutdown();
    }

    @Test
    public void helloWorldTest() throws URISyntaxException {
        ResponseEntity<String> response = rest.getForEntity("/", String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    private MockResponse getMockResponse(String path) {
        Buffer buffer = new Buffer();
        try {
            InputStream inputStream = new ClassPathResource(path).getInputStream();
            ByteArrayResource byteArrayResource = new ByteArrayResource(IOUtils.toByteArray(inputStream));
            buffer.write(byteArrayResource.getByteArray());
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
        return new MockResponse().setBody(buffer);
    }
}

@Configuration
class RibbonClientConfiguration {
    @Bean
    public ILoadBalancer ribbonLoadBalancer() {
        return new BaseLoadBalancer();
    }
}