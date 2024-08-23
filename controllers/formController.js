const Form = require("../models/formModel");

const createForm = async (req, res) => {
  const { name, date, answers } = req.body;

  // Tính tổng điểm cho từng nhóm
  const group1Questions = [1, 6, 8, 11, 12, 14, 18];
  const group2Questions = [2, 4, 7, 9, 15, 19, 20];
  const group3Questions = [3, 5, 10, 13, 16, 17, 21];

  const sumGroup1 = group1Questions.reduce(
    (total, question) => total + answers[question],
    0
  );
  const sumGroup2 = group2Questions.reduce(
    (total, question) => total + answers[question],
    0
  );
  const sumGroup3 = group3Questions.reduce(
    (total, question) => total + answers[question],
    0
  );

  // Đánh giá mức độ stress
  let stressLevel;
  if (sumGroup1 <= 7) stressLevel = "Không bị Stress";
  else if (sumGroup1 <= 9) stressLevel = "Stress nhẹ";
  else if (sumGroup1 <= 12) stressLevel = "Stress vừa";
  else if (sumGroup1 <= 16) stressLevel = "Stress nặng";
  else stressLevel = "Stress rất nặng";

  // Đánh giá mức độ trầm cảm
  let depressionLevel;
  if (sumGroup2 <= 4) depressionLevel = "Không có dấu hiệu trầm cảm";
  else if (sumGroup2 <= 6) depressionLevel = "Trầm cảm nhẹ";
  else if (sumGroup2 <= 10) depressionLevel = "Trầm cảm vừa";
  else if (sumGroup2 <= 13) depressionLevel = "Trầm cảm nặng";
  else depressionLevel = "Trầm cảm rất nặng";

  // Đánh giá mức độ lo âu
  let anxietyLevel;
  if (sumGroup3 <= 3) anxietyLevel = "Không bị lo âu";
  else if (sumGroup3 <= 5) anxietyLevel = "Lo âu nhẹ";
  else if (sumGroup3 <= 7) anxietyLevel = "Lo âu vừa";
  else if (sumGroup3 <= 9) anxietyLevel = "Lo âu nặng";
  else anxietyLevel = "Lo âu rất nặng";

  // Tạo đối tượng Form và lưu vào database
  const form = new Form({
    name,
    date,
    answers,
    stressLevel,
    depressionLevel,
    anxietyLevel,
  });

  form
    .save()
    .then(() => {
      res.status(200).json({
        message: "Form data saved successfully",
        form: {
          name: form.name,
          date: form.date,
          stressLevel,
          depressionLevel,
          anxietyLevel,
        },
      });
    })
    .catch((error) => {
      res.status(500).send({ message: "Error saving form data", error });
    });
};
module.exports = {
  createForm,
};
