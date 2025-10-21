"use client";

import { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";
import {Prediction} from '@/types/index'

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    setPredictions([]);
  };

  const classifyImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const img = document.getElementById("uploaded-image") as HTMLImageElement;
      const model = await mobilenet.load();
      const preds = await model.classify(img);
      setPredictions(preds);
    } catch (error) {
      console.error("Classification error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Image Classifier
          </h1>
          <p className="text-gray-400 text-lg">
            Powered by TensorFlow MobileNet
          </p>
        </div>

        {/* Upload Card */}
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Select an image to classify using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        {/* Image Preview & Classification */}
        {image && (
          <Card className="bg-white border-2 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <img
                  id="uploaded-image"
                  src={image}
                  alt="uploaded"
                  className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-200"
                />
                <Button
                  onClick={classifyImage}
                  disabled={loading}
                  className="w-full max-w-md bg-black hover:bg-gray-800 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Classify Image
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {predictions.length > 0 && (
          <Card className="bg-white border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Classification Results
              </CardTitle>
              <CardDescription>
                Top predictions from the AI model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="font-medium text-gray-900">
                        {p.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-500"
                          style={{ width: `${p.probability * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-16 text-right">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}