package com.project;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class Main {
	public static void main (String ... args){
		ExecutorService executor = Executors.newFixedThreadPool(2);

		Runnable tasklogs = () -> printlogs();
		Runnable taskipa = () -> printIp();

		executor.execute(tasklogs);
        executor.execute(taskipa);

		executor.shutdown();
	}


	private static void printlogs() {
		System.out.println("dhcpd.service - Dhcp Daemon");
		System.out.println("Loaded: loaded (/etc/dhcp/dhcpd.conf; enabled; vendor preset: enabled)");
		System.out.println("Active: active (running) since Tue 2024-08-04 04:29:19 UTC; 7 weeks 2 days ago");
		System.out.println("Memory: 56.5M");
	}

	private static void printIp() {
		System.out.print("""
	3: wlp148s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether f4:26:79:ef:6d:b6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.16.186/21 brd 192.168.23.255 scope global dynamic noprefixroute wlp148s0
    valid_lft 17082sec preferred_lft 17082sec
    inet6 fe80::c62b:d4af:30f2:fb8b/64 scope link noprefixroute 
    valid_lft forever preferred_lft forever""");
	}
}
