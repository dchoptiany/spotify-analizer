package controllers

import (
	"bufio"
	"net/http"
	"os"
	"spotify_insights/datacollector/config"
	"spotify_insights/datacollector/models"

	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
)

const PlaylistsFilename = config.TopPlaylistsIDFile

func GetTopTracks(c *gin.Context) {
	var err error
	var client models.Client
	var spotifyPlaylist *spotify.FullPlaylist = nil
	var spotifyArtist *spotify.FullArtist = nil
	var dataPlaylist models.DataSketchesPlaylist = models.DataSketchesPlaylist{make([]models.DataSketchesTrack, 0)}

	// create client
	// TODO: Change for token read from JSON #?
	client = models.CreateClient()
	spotifyClient := client.SpotifyClient

	// open playlistsFile
	file, err := os.Open(PlaylistsFilename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		playlistID := scanner.Text()
		spotifyPlaylist, err = spotifyClient.GetPlaylist(spotify.ID(playlistID))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}

		totalNumOfSpotifyTracks := spotifyPlaylist.Tracks.Total

		// playlist's tracks
		spotifyTrackArr := spotifyPlaylist.Tracks.Tracks

		for i := 0; i < totalNumOfSpotifyTracks; i++ {
			dataTrack := models.DataSketchesTrack{}

			// playlist's track
			spotifyTrack := spotifyTrackArr[i].Track

			// id
			dataTrack.ID = string(spotifyTrack.ID)

			// get track's artist's full info
			spotifyArtist, err = spotifyClient.GetArtist(spotifyTrack.Artists[0].ID)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}

			// genre
			if len(spotifyArtist.Genres) > 0 {
				dataTrack.Genre = spotifyArtist.Genres[0]
			}

			// release date
			dataTrack.Release_date = spotifyTrack.Album.ReleaseDate

			// add tracks to playlistForAnalysis
			dataPlaylist.Tracks = append(dataPlaylist.Tracks, dataTrack)
		}

		// send dataPlaylist as JSON
		c.JSON(http.StatusOK, dataPlaylist)
	}
}
