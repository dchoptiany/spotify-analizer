#pragma once

#include <vector>
#include <random>
#include <string>

class FastExpSketch
{
private:
    std::vector<unsigned> permInit;
    std::vector<float> M;
    size_t size;
    float maxValue;

    void initialize();
    template <typename T> void swap(T& lhs, T& rhs);
    float hash(unsigned i, unsigned k, unsigned seed);
    
public:
    FastExpSketch(size_t size);
    FastExpSketch(const std::vector<float>& values);
    void update(unsigned i, float lambda);
    float estimateCardinality();
    void saveToFile(const std::string&);
};