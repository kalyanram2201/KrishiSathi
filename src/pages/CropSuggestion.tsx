import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Leaf, Thermometer, Droplets, Calendar, MapPin, TrendingUp } from 'lucide-react';

interface FormData {
  soilType: string;
  ph: number;
  moisture: string;
  season: string;
  location: string;
  farmSize: number;
  previousCrop: string;
}

const CropSuggestion: React.FC = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const cropDatabase = [
    {
      name: 'Wheat',
      suitability: 95,
      expectedYield: '3.5 tons/hectare',
      season: 'Rabi',
      profitability: 'High',
      waterRequirement: 'Medium',
      advantages: ['High market demand', 'Good storage life', 'Government support'],
      considerations: ['Requires proper irrigation', 'Monitor for rust diseases'],
      icon: '🌾',
    },
    {
      name: 'Rice',
      suitability: 88,
      expectedYield: '4.2 tons/hectare',
      season: 'Kharif',
      profitability: 'Medium',
      waterRequirement: 'High',
      advantages: ['Stable market', 'Food security crop', 'Multiple varieties'],
      considerations: ['High water requirement', 'Labor intensive'],
      icon: '🌾',
    },
    {
      name: 'Tomato',
      suitability: 92,
      expectedYield: '25 tons/hectare',
      season: 'Year-round',
      profitability: 'Very High',
      waterRequirement: 'Medium',
      advantages: ['High profit margins', 'Short growing cycle', 'Multiple harvests'],
      considerations: ['Disease prone', 'Requires market access'],
      icon: '🍅',
    },
    {
      name: 'Cotton',
      suitability: 78,
      expectedYield: '2.8 tons/hectare',
      season: 'Kharif',
      profitability: 'High',
      waterRequirement: 'Medium',
      advantages: ['Industrial demand', 'Export potential', 'Byproduct value'],
      considerations: ['Pest management critical', 'Price volatility'],
      icon: '🌱',
    },
  ];

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate recommendations based on form data
    let filteredCrops = [...cropDatabase];
    
    // Adjust suitability based on conditions
    filteredCrops = filteredCrops.map(crop => {
      let adjustedSuitability = crop.suitability;
      
      // Season matching
      if (data.season === crop.season || crop.season === 'Year-round') {
        adjustedSuitability += 5;
      } else {
        adjustedSuitability -= 10;
      }
      
      // Soil pH considerations
      if (data.ph >= 6.0 && data.ph <= 7.5) {
        adjustedSuitability += 5;
      } else {
        adjustedSuitability -= 5;
      }
      
      // Moisture considerations
      if (data.moisture === 'high' && crop.waterRequirement === 'High') {
        adjustedSuitability += 5;
      } else if (data.moisture === 'low' && crop.waterRequirement === 'High') {
        adjustedSuitability -= 15;
      }
      
      return {
        ...crop,
        suitability: Math.max(0, Math.min(100, adjustedSuitability)),
      };
    });
    
    // Sort by suitability and take top 3
    filteredCrops.sort((a, b) => b.suitability - a.suitability);
    setSuggestions(filteredCrops.slice(0, 3));
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Smart Crop Suggestions</h1>
          <p className="text-lg text-gray-600">
            Get AI-powered crop recommendations based on your soil and environmental conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Farm Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  <select
                    {...register('soilType', { required: 'Soil type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select soil type</option>
                    <option value="clay">Clay</option>
                    <option value="loam">Loam</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                    <option value="peat">Peat</option>
                  </select>
                  {errors.soilType && <p className="text-red-500 text-xs mt-1">{errors.soilType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Thermometer className="mr-1 h-4 w-4" />
                    Soil pH
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="14"
                    {...register('ph', { 
                      required: 'pH value is required',
                      min: { value: 1, message: 'pH must be between 1 and 14' },
                      max: { value: 14, message: 'pH must be between 1 and 14' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 6.5"
                  />
                  {errors.ph && <p className="text-red-500 text-xs mt-1">{errors.ph.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Droplets className="mr-1 h-4 w-4" />
                    Moisture Level
                  </label>
                  <select
                    {...register('moisture', { required: 'Moisture level is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select moisture level</option>
                    <option value="low">Low (Arid/Semi-arid)</option>
                    <option value="medium">Medium (Moderate)</option>
                    <option value="high">High (Humid)</option>
                  </select>
                  {errors.moisture && <p className="text-red-500 text-xs mt-1">{errors.moisture.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Season
                  </label>
                  <select
                    {...register('season', { required: 'Season is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select season</option>
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Year-round">Year-round</option>
                  </select>
                  {errors.season && <p className="text-red-500 text-xs mt-1">{errors.season.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  Location/Region
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Punjab, India"
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Size (hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    {...register('farmSize', { 
                      required: 'Farm size is required',
                      min: { value: 0.1, message: 'Farm size must be positive' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 2.5"
                  />
                  {errors.farmSize && <p className="text-red-500 text-xs mt-1">{errors.farmSize.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Crop
                  </label>
                  <input
                    type="text"
                    {...register('previousCrop')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Rice (optional)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyzing Conditions...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Get Crop Suggestions
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Crops</h2>

            {suggestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Fill out the form to get personalized crop suggestions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((crop, index) => (
                  <motion.div
                    key={crop.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{crop.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                          <div className="flex items-center mt-1">
                            <div className="bg-green-100 px-2 py-1 rounded text-sm">
                              <span className="text-green-800 font-medium">{crop.suitability}% suitable</span>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {crop.profitability} profitability
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Expected Yield:</span>
                        <span className="ml-1 font-medium">{crop.expectedYield}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Water Need:</span>
                        <span className="ml-1 font-medium">{crop.waterRequirement}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-green-700">Advantages:</span>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {crop.advantages.map((advantage: string, i: number) => (
                            <li key={i}>• {advantage}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-orange-700">Considerations:</span>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {crop.considerations.map((consideration: string, i: number) => (
                            <li key={i}>• {consideration}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestion;
