from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "LiYuan/amazon-review-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Save to local directory
model.save_pretrained('./model')
tokenizer.save_pretrained('./model')
