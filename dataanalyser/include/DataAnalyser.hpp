#pragma once

#include "FastExpSketch.hpp"
#include "SketchKey.hpp"
#include <unordered_map>
#include <map>
#include <array>
#include <ctime>

class DataAnalyser
{
private:
    const static size_t DEFAULT_SKETCH_SIZE = 512;
    const static size_t NUMBER_OF_GENRES = 17;
    const std::array<std::string, NUMBER_OF_GENRES> GENRES = 
    {
        "blues",
        "classical",
        "dance",
        "disco",
        "hip", // hip hop
        "indie",
        "j-pop",
        "jazz",
        "k-pop",
        "latin",
        "lo-fi",
        "metal",
        "pop", 
        "r&b",
        "rap",
        "rock",
        "techno"
    };
    const std::map<std::string, std::string> DISPLAYABLE_GENRES = 
    {
        {"blues", "Blues"},
        {"classical", "Classical"},
        {"dance", "Dance"},
        {"disco", "Disco"},
        {"hip", "Hip Hop"},
        {"indie", "Indie"},
        {"j-pop", "J-Pop"},
        {"jazz", "Jazz"},
        {"k-pop", "K-Pop"},
        {"latin", "Latin"},
        {"lo-fi", "Lo-Fi"},
        {"metal", "Metal"},
        {"pop", "Pop"},
        {"r&b", "R&B"},
        {"rap", "Rap"},
        {"rock", "Rock"},
        {"techno", "Techno"}
    };

    std::string getDecade(const std::string&);
    std::vector<std::pair<std::string, unsigned>> getTop(const std::unordered_map<std::string, unsigned>&, size_t, const std::unordered_map<std::string, std::string>&);
    void increment(std::unordered_map<std::string, unsigned>&, const std::string&);
    void increment(std::unordered_map<std::string, unsigned>&, std::unordered_map<std::string, std::string>&, const std::string&, const std::string&);
    std::string formatDuration(unsigned);
    std::string formatDate(std::tm);
    std::tm stringToDate(const std::string&);
    std::vector<std::string> split(const std::string&, const std::string&);
    unsigned hash(const std::string&);

public:
    std::map<SketchKey, FastExpSketch*> sketches;
    
    ~DataAnalyser();
    std::string analysePlaylist(const std::string &);
    std::string analyseLikedTracks(const std::string &);
    std::string analyseGlobalTrends(const std::string&);
    void updateDataSketch(FastExpSketch*, const std::vector<std::pair<unsigned, float>>&);
    void updateDataSketches(const std::string&);
};
