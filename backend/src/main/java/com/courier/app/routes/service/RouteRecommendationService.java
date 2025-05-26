package com.courier.app.routes.service;

import com.courier.app.routes.model.DeliveryOrder;
import org.apache.commons.math3.ml.clustering.CentroidCluster;
import org.apache.commons.math3.ml.clustering.Clusterable;
import org.apache.commons.math3.ml.clustering.KMeansPlusPlusClusterer;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RouteRecommendationService {

    public Map<Integer, List<DeliveryOrder>> groupDeliveries(List<DeliveryOrder> orders, int k) {
        if (orders.size() <= k) {
            return IntStream.range(0, orders.size())
                    .boxed()
                    .collect(Collectors.toMap(i -> i, i -> List.of(orders.get(i))));
        }

        double[][] locations = new double[orders.size()][2];
        for (int i = 0; i < orders.size(); i++) {
            locations[i][0] = orders.get(i).getDropLatitude();
            locations[i][1] = orders.get(i).getDropLongitude();
        }

        KMeansPlusPlusClusterer<ClusterablePoint> clusterer = new KMeansPlusPlusClusterer<>(k);
        List<ClusterablePoint> points = Arrays.stream(locations)
                .map(ClusterablePoint::new)
                .toList();

        List<CentroidCluster<ClusterablePoint>> clusters = clusterer.cluster(points);

        Map<Integer, List<DeliveryOrder>> grouped = new HashMap<>();
        for (int i = 0; i < clusters.size(); i++) {
            List<DeliveryOrder> group = new ArrayList<>();
            for (ClusterablePoint point : clusters.get(i).getPoints()) {
                int index = points.indexOf(point);
                group.add(orders.get(index));
            }
            grouped.put(i, group);
        }

        return grouped;
    }

    // Clusterable wrapper for Apache Commons Math
    static class ClusterablePoint implements Clusterable {
        private final double[] point;
        public ClusterablePoint(double[] point) {
            this.point = point;
        }
        public double[] getPoint() {
            return point;
        }
        @Override
        public boolean equals(Object o) {
            return Arrays.equals(point, ((ClusterablePoint) o).point);
        }
        @Override
        public int hashCode() {
            return Arrays.hashCode(point);
        }
    }
}
