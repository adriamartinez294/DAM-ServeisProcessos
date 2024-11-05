package com.project;

import java.util.Map;
import java.util.concurrent.*;

import java.util.List;
import java.util.Arrays;

public class Main {

    public static void main(String[] args) {
        List<Double> data = Arrays.asList(10.0, 20.0, 30.0, 40.0, 50.0);
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("Càlculs complets. Mostrant resultats finals...");
            System.out.println("Mitjana: " + StatsResult.getAverage());
            System.out.println("Suma: " + StatsResult.getSum());
            System.out.println("Desviació estàndard: " + StatsResult.getStandardDeviation());
        });

        ExecutorService executor = Executors.newFixedThreadPool(3);

        try {
            executor.submit(new AverageTask(data, barrier));
            executor.submit(new SumTask(data, barrier));
            executor.submit(new StandardDeviationTask(data, barrier));
        } finally {
            executor.shutdown();
        }
    }
}

class AverageTask implements Runnable {
    private final List<Double> data;
    private final CyclicBarrier barrier;

    public AverageTask(List<Double> data, CyclicBarrier barrier) {
        this.data = data;
        this.barrier = barrier;
    }

    @Override
    public void run() {
        double sum = data.stream().mapToDouble(Double::doubleValue).sum();
        StatsResult.setAverage(sum / data.size());
        try {
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            System.err.println("Error a AverageTask: " + e.getMessage());
        }
    }
}

class SumTask implements Runnable {
    private final List<Double> data;
    private final CyclicBarrier barrier;

    public SumTask(List<Double> data, CyclicBarrier barrier) {
        this.data = data;
        this.barrier = barrier;
    }

    @Override
    public void run() {
        double sum = data.stream().mapToDouble(Double::doubleValue).sum();
        StatsResult.setSum(sum);
        try {
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            System.err.println("Error a SumTask: " + e.getMessage());
        }
    }
}

class StandardDeviationTask implements Runnable {
    private final List<Double> data;
    private final CyclicBarrier barrier;

    public StandardDeviationTask(List<Double> data, CyclicBarrier barrier) {
        this.data = data;
        this.barrier = barrier;
    }

    @Override
    public void run() {
        double mean = data.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double variance = data.stream().mapToDouble(d -> Math.pow(d - mean, 2)).sum() / data.size();
        StatsResult.setStandardDeviation(Math.sqrt(variance));
        try {
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            System.err.println("Error a StandardDeviationTask: " + e.getMessage());
        }
    }
}

class StatsResult {
    private static double average;
    private static double sum;
    private static double standardDeviation;

    public static synchronized void setAverage(double avg) { average = avg; }
    public static synchronized void setSum(double s) { sum = s; }
    public static synchronized void setStandardDeviation(double sd) { standardDeviation = sd; }

    public static double getAverage() { return average; }
    public static double getSum() { return sum; }
    public static double getStandardDeviation() { return standardDeviation; }
}