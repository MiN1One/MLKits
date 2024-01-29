const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

const distance = (pointA, pointB) => {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
};

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  // let numberCorrect = 0;
  // for (let testData of testSet) {
  //   const bucket = knn(trainingSet, testData[0]);
  //   const testDataBucket = testData[3];
  //   if (testDataBucket === bucket) {
  //     numberCorrect++;
  //   }
  //   console.log('Predicted bucket', bucket, testDataBucket);
  // }
  // console.log('Accuracy', numberCorrect / testSetSize);

  // k = 1 - 14
  _.range(1, 15).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log('For k of', k, 'accuracy is', accuracy);
  });
}

const knn = (data, testDataPoint, k) => {
  return _.chain(data)
    .map((row) => {
      const features = _.initial(row);
      const label = _.last(row);
      const testDataFeatures = _.initial(testDataPoint);
      return [distance(features, testDataFeatures), label];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
};

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  const testData = _.slice(shuffled, 0, testCount);
  const trainingData = _.slice(shuffled, testCount);

  return [testData, trainingData];
};
