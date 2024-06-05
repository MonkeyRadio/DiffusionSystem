file.mkdir("/output/tmp")

def hls_output(stream, stream_name)  

  aac_lo = %ffmpeg(format="mpegts",
                    %audio(
                      codec="libfdk_aac",
                      samplerate=44100,
                      b="32k",
                      afterburner=1,
                      profile="aac_he_v2"
                    ))

  aac_mid = %ffmpeg(format="mpegts",
                      %audio(
                        codec="libfdk_aac",
                        samplerate=44100,
                        b="128k",
                        afterburner=1,
                        profile="aac_he"
                      ))

  aac_hi = %ffmpeg(format="mpegts",
                      %audio(
                        codec="aac",
                        samplerate=48000,
                        b="576k",
                      ))

  streams_nfo = [("aac_lo",aac_lo),
            ("aac_mid", aac_mid),
            ("aac_hi", aac_hi)]

  def segment_name(~position,~extname,stream_name) =
    timestamp = int_of_float(time())
    duration = 2
    "#{stream_name}_#{duration}_#{timestamp}_#{position}.#{extname}"
  end

  output.file.hls(playlist="#{stream_name}.m3u8",
                  temp_dir="/output/tmp",
                  segment_duration=2.0,
                  segments=1800,
                  segments_overhead=5,
                  segment_name=segment_name,
                  persist_at="/persist_output/#{stream_name}/state.config",
                  "/output/#{stream_name}",
                  streams_nfo,
                  stream)
end