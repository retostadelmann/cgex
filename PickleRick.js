function PickleRick(gl) {
    /** Get point at the beziercurve at time t */
    function getPointOnBezierCurve(controlPoints, offset, t) {
        const invT = (1 - t);
        return v2.add(v2.mult(controlPoints[offset + 0], invT * invT * invT),
            v2.mult(controlPoints[offset + 1], 3 * t * invT * invT),
            v2.mult(controlPoints[offset + 2], 3 * invT * t * t),
            v2.mult(controlPoints[offset + 3], t * t * t));
    }

    /** Get n Points on the Bezier Curve */
    function getPointsOnBezierCurve(controlPoints, offset, numPoints) {
        const cpoints = [];
        for (let i = 0; i < numPoints; ++i) {
            const t = i / (numPoints - 1);
            cpoints.push(getPointOnBezierCurve(controlPoints, offset, t));
        }
        return cpoints;
    }

    /** Decide if the curve needs to be split or not */
    function flatness(points, offset) {
        const p1 = points[offset + 0];
        const p2 = points[offset + 1];
        const p3 = points[offset + 2];
        const p4 = points[offset + 3];

        let ux = 3 * p2[0] - 2 * p1[0] - p4[0];
        ux *= ux;
        let uy = 3 * p2[1] - 2 * p1[1] - p4[1];
        uy *= uy;
        let vx = 3 * p3[0] - 2 * p4[0] - p1[0];
        vx *= vx;
        let vy = 3 * p3[1] - 2 * p4[1] - p1[1];
        vy *= vy;

        if (ux < vx) {
            ux = vx;
        }

        if (uy < vy) {
            uy = vy;
        }

        return ux + uy;
    }

    /** Get points for a curve if it's not to curvy*/
    function getPointsOnBezierCurveWithSplitting(controlPoints, offset, tolerance, newPoints) {
        const outPoints = newPoints || [];
        if (flatness(controlPoints, offset) < tolerance) {

            // just add the end points of this curve
            outPoints.push(controlPoints[offset + 0]);
            outPoints.push(controlPoints[offset + 3]);

        } else {

            // subdivide
            const t = .5;
            const p1 = controlPoints[offset + 0];
            const p2 = controlPoints[offset + 1];
            const p3 = controlPoints[offset + 2];
            const p4 = controlPoints[offset + 3];

            const q1 = v2.lerp(p1, p2, t);
            const q2 = v2.lerp(p2, p3, t);
            const q3 = v2.lerp(p3, p4, t);

            const r1 = v2.lerp(q1, q2, t);
            const r2 = v2.lerp(q2, q3, t);

            const red = v2.lerp(r1, r2, t);

            // do 1st half
            getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
            // do 2nd half
            getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints);

        }
        return outPoints;
    }

    /** Get rid of unnecessary points */
    function simplifyPoints(controlPoints, start, end, epsilon, newPoints) {
        const outPoints = newPoints || [];

        // find the most distance point from the endpoints
        const s = controlPoints[start];
        const e = controlPoints[end - 1];
        let maxDistSq = 0;
        let maxNdx = 1;
        for (let i = start + 1; i < end - 1; ++i) {
            const distSq = v2.distanceToSegmentSq(controlPoints[i], s, e);
            if (distSq > maxDistSq) {
                maxDistSq = distSq;
                maxNdx = i;
            }
        }

        // if that point is too far
        if (Math.sqrt(maxDistSq) > epsilon) {

            // split
            simplifyPoints(controlPoints, start, maxNdx + 1, epsilon, outPoints);
            simplifyPoints(controlPoints, maxNdx, end, epsilon, outPoints);

        } else {

            // add the 2 end points
            outPoints.push(s, e);
        }

        return outPoints;
    }


    /** gets points across all segments */
    function getPointsOnBezierCurves(controlPoints, tolerance) {
        const newPoints = [];
        const numSegments = (controlPoints.length - 1) / 3;
        for (let i = 0; i < numSegments; ++i) {
            const offset = i * 3;
            getPointsOnBezierCurveWithSplitting(controlPoints, offset, tolerance, newPoints);
        }
        return newPoints;
    }

    function defineControlPoints(){
        return [
            44, 371,
            62, 338,
            63, 305,
            59, 260, 55, 215,
            22, 156,
            20, 128,
            18, 100,
            31,  77,
            36,  47,
            41,  17,
            39, -16,
            0, -16
        ]
    }

    return {
        bufferVertices: getPointsOnBezierCurves(defineControlPoints(), 0.1),

        draw: function (gl) {

        }
    }
}






