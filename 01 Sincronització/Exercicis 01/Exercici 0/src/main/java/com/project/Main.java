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
import java.util.concurrent.CyclicBarrier;

public class Main{

    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("Totes les tasques han acabat. Combinant resultats...");
            String resultatFinal = MicroserviceResult.getCombinedResult();
            System.out.println("Resultat Final: " + resultatFinal);
        });

        ExecutorService executor = Executors.newFixedThreadPool(3);

        try {
            executor.submit(new MicroserviceTask("Microservei A", barrier, "Dades A"));
            executor.submit(new MicroserviceTask("Microservei B", barrier, "Dades B"));
            executor.submit(new MicroserviceTask("Microservei C", barrier, "Dades C"));
        } finally {
            executor.shutdown();
        }
    }
}

class MicroserviceTask implements Runnable {
    private final String name;
    private final CyclicBarrier barrier;
    private final String data;

    public MicroserviceTask(String name, CyclicBarrier barrier, String data) {
        this.name = name;
        this.barrier = barrier;
        this.data = data;
    }

    @Override
    public void run() {
        try {
            System.out.println(name + " processant: " + data);
            Thread.sleep((long) (Math.random() * 1000));
            MicroserviceResult.addResult(data);
            System.out.println(name + " ha acabat el processament.");
            barrier.await();
        } catch (Exception e) {
            System.err.println(name + " ha tingut un error: " + e.getMessage());
        }
    }
}

class MicroserviceResult {
    private static final StringBuilder combinedResult = new StringBuilder();

    public synchronized static void addResult(String result) {
        combinedResult.append(result).append(" ");
    }

    public static String getCombinedResult() {
        return combinedResult.toString().trim();
    }
}
