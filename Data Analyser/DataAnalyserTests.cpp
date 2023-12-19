#include "DataAnalyser.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <random>
#include <ctime>
#include <chrono>

/*
Simple script for testing Data Analyser.
Running without arguments will run analysePlaylist, analyseLikedTracks 
and single cardinality esitmation test with data from file sample.json.
Running with one parameter will run single cardinality estimation test 
on FastExpSketch with given number of samples.
*/

std::mt19937 mt(time(NULL));

void testPlaylistAnalysis(const std::string& inputJson)
{
    DataAnalyser *dataAnalyser = new DataAnalyser(false);
    std::cout << dataAnalyser->analysePlaylist(inputJson) << std::endl;
    delete dataAnalyser;
}

void testLikedTracksAnalysis(const std::string& inputJson)
{
    DataAnalyser *dataAnalyser = new DataAnalyser(false);
    std::cout << dataAnalyser->analyseLikedTracks(inputJson) << std::endl;
    delete dataAnalyser;
}

void testDataSketches(const std::string& inputJson)
{
    DataAnalyser* dataAnalyser = new DataAnalyser(true);
    dataAnalyser->updateDataSketches(inputJson);

    for(const auto& sketch : dataAnalyser->sketches)
    {
        std::cout << "[" << sketch.first.toString() << "]: " << sketch.second->estimateCardinality() << std::endl;
    }

    delete dataAnalyser;
}

// Randomly shuffles vector using Fisher-Yaets algorithm
template<typename T>
void shuffle(std::vector<T>& vec)
{
    T temp;
    size_t j;
    size_t n = vec.size();
    for (size_t i = 0; i <= n - 2; i++)
    {
        j = i + mt() % (n - i);
        temp = vec[i];
        vec[i] = vec[j];
        vec[j] = temp;
    }
}

void testDataSketches(size_t samples)
{
    DataAnalyser* dataAnalyser = new DataAnalyser(true);
    FastExpSketch* sketch = dataAnalyser->sketches[SketchKey("pop")];
    
    std::vector<std::pair<unsigned, float>> stream;
    stream.reserve(samples);
    for(size_t i = 0; i < samples; i++)
    {
        stream.push_back(std::make_pair(i, 1.0));
    }

    auto start = std::chrono::high_resolution_clock().now();
    dataAnalyser->updateDataSketch(sketch, stream);
    auto end = std::chrono::high_resolution_clock().now();

    std::cout << "Updating " << stream.size() << " pairs took " << 
                 std::chrono::duration_cast<std::chrono::seconds>(end - start).count()
                 << " seconds." << std::endl;

    std::cout << "Cardinality: " << sketch->estimateCardinality() << std::endl;

    delete dataAnalyser;
}

int main(int argc, char** argv)
{
    if(argc > 1)
    {
        size_t samples = std::stoi(argv[1]);
        testDataSketches(samples);    
    }
    else
    {
        std::fstream file("sample.json", std::ios::in);
        if(!file.good())
        {
            std::cerr << "Could not open file sample.json" << std::endl;
            return 1;
        }
        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string sampleData = buffer.str();
        testPlaylistAnalysis(sampleData);
        testLikedTracksAnalysis(sampleData);
        testDataSketches(sampleData);
    }
    
    return 0;
}