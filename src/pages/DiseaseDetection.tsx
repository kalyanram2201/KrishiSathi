import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, AlertCircle, CheckCircle, Leaf, RefreshCw } from 'lucide-react';

const DiseaseDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI results
    const mockResults = [
      {
        disease: 'Healthy',
        confidence: 94.5,
        treatments: {
          organic: ['Continue regular watering', 'Apply compost monthly', 'Ensure adequate sunlight'],
          chemical: ['No treatment needed', 'Preventive fungicide spray (optional)'],
        },
        severity: 'none',
        color: 'green',
      },
      {
        disease: 'Late Blight',
        confidence: 87.2,
        treatments: {
          organic: ['Remove affected leaves', 'Apply neem oil spray', 'Improve air circulation', 'Copper fungicide'],
          chemical: ['Chlorothalonil spray', 'Mancozeb treatment', 'Reduce humidity'],
        },
        severity: 'high',
        color: 'red',
      },
      {
        disease: 'Early Blight',
        confidence: 78.9,
        treatments: {
          organic: ['Remove infected parts', 'Baking soda spray', 'Crop rotation', 'Organic mulching'],
          chemical: ['Azoxystrobin treatment', 'Chlorothalonil spray'],
        },
        severity: 'medium',
        color: 'yellow',
      },
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(randomResult);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Crop Disease Detection</h1>
          <p className="text-lg text-gray-600">
            Upload a photo of your crop leaves for instant disease identification and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Upload Crop Image
            </h2>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">Drop your image here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Selected crop"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                
                {!result && !isAnalyzing && (
                  <button
                    onClick={simulateAnalysis}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    Analyze Crop Health
                  </button>
                )}

                {isAnalyzing && (
                  <div className="w-full py-3 px-4 bg-blue-50 rounded-lg text-center">
                    <div className="animate-spin mx-auto h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-blue-700 font-medium">Analyzing image...</p>
                    <p className="text-blue-600 text-sm">Our AI is examining your crop for diseases</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Upload an image to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Disease Detection */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  result.color === 'green' ? 'bg-green-50 border-green-500' :
                  result.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{result.disease}</h3>
                    {result.disease === 'Healthy' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Confidence: <span className="font-medium">{result.confidence}%</span>
                  </p>
                  {result.severity !== 'none' && (
                    <p className="text-sm">
                      Severity: <span className={`font-medium ${
                        result.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Treatment Recommendations */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Treatment Recommendations</h4>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">🌱 Organic Treatments</h5>
                    <ul className="space-y-1 text-sm text-green-700">
                      {result.treatments.organic.map((treatment: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">🧪 Chemical Treatments</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {result.treatments.chemical.map((treatment: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={resetAnalysis}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
