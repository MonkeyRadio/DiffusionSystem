def blank_rescue(stream, playlist_path)
  rescue = playlist(playlist_path)

  def blankRescue()
    rescue.skip()
    print("Blank detected -> Rescue starting")
  end

  def noiseRescue()
    print("NOIIIIISE")
  end

  stream = blank.detect(
    max_blank=15.,
    threshold=-60.,
    on_noise=noiseRescue,
    blankRescue,
    stream
  )

  fallback(
    track_sensitive=false,
    transition_length=0.5,
    [
      blank.strip(
        max_blank=15.,
        threshold=-60.,
        stream
      ),
      rescue
    ]
  )
end
