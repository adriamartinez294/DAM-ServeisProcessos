package com.project;

import java.util.Map;
import java.util.concurrent.*;

public class Main {

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        ConcurrentHashMap<String, Double> sharedData = new ConcurrentHashMap<>();

        Runnable addInitialData = () -> addData(sharedData);
        Runnable modifyData = () -> applyInterest(sharedData);
        Callable<Double> readFinalBalance = () -> readBalance(sharedData);

        executor.execute(addInitialData);
        executor.execute(modifyData);

        Future<Double> finalBalanceFuture = executor.submit(readFinalBalance);
        Double finalBalance = finalBalanceFuture.get();
        System.out.println("Saldo final: " + finalBalance);

        executor.shutdown();
    }

    private static void addData(Map<String, Double> sharedData) {
        sharedData.put("balance", 1000.0);
        System.out.println("Saldo inicial afegit: " + sharedData.get("balance"));
    }

    private static void applyInterest(Map<String, Double> sharedData) {
        Double currentBalance = sharedData.get("balance");
        if (currentBalance != null) {
            currentBalance += currentBalance * 0.05;
            sharedData.put("balance", currentBalance);
            System.out.println("Nou saldo amb interessos: " + sharedData.get("balance"));
        }
    }

    private static Double readBalance(Map<String, Double> sharedData) {
        return sharedData.get("balance");
    }
}
