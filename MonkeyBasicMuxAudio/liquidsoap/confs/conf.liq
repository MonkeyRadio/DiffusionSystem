%include "outputs.liq"


set("init.allow_root", true)

set("frame.audio.samplerate", 48000)


# MONKEY Mixing and Processing

# Var :
region = "nat"
icePoint = "monkeyMUXED_MP3_MID"

# Sources
natio = input.http("http://127.0.0.1:8000/monkeyNatio")

stud1 = input.http("http://127.0.0.1:8000/stud1")

stud2 = input.http("http://127.0.0.1:8000/stud2")

stud3 = input.http("http://127.0.0.1:8000/stud3")

radioS = add([natio, stud1, stud2, stud3])

radioS = mksafe(radioS)

#Blank detection and rescue disk

rescue = playlist("rescue.txt")

def blankRescue()
  rescue.skip()
  print("Blank detected -> Rescue starting")
end

def noiseRescue()
  print("NOIIIIISE")
end

radioS = blank.detect(max_blank=15.,
		threshold=-60.,
		on_noise=noiseRescue,
		blankRescue,
		radioS)

radioRescued = fallback(track_sensitive=false, transition_length=0.,
                  [ blank.strip(max_blank=15.,threshold=-60.,radioS) , rescue ])

radio = mksafe(radioRescued)


# Sound Processing MIXER

radio = normalize(gain_max = 20.0, gain_min = -11.0, target = -7., threshold = -40.0, window = 0.1, up = 2., down = 0.1, radio)

# r0lo = filter.iir.eq.low(frequency = 30., radio)
# 
# r1lo = filter.iir.eq.low(frequency = 60., filter.iir.eq.high(frequency = 30., radio))
# 
# r2lo = filter.iir.eq.low(frequency = 90., filter.iir.eq.high(frequency = 60., radio))
# 
# r3lo = filter.iir.eq.low(frequency = 110., filter.iir.eq.high(frequency = 90., radio))
# 
# r6lo = filter.iir.eq.low(frequency = 1100., filter.iir.eq.high(frequency = 180., radio))
# 
# r7hi = filter.iir.eq.high(frequency = 1100., radio)
# 
# # Add back
# compressed = add(normalize = false,
# [ compress(attack = 50., release = 200., threshold = 0.,
# ratio = 2.5, gain = -4.0, knee = 1.0,
# r0lo, wet = 0.3),
# 
# compress(attack = 50., release = 200., threshold = 0.,
# ratio = 2.2, gain = -2.3, knee = 1.0,
# r1lo, wet = 0.4),
# 
# compress(attack = 50., release = 200., threshold = 0.,
# ratio = 1.8, gain = -1.2, knee = 1.0,
# r2lo),
# 
# compress(attack = 50., release = 200., threshold = 0.,
# ratio = 1.5, gain = -0.5, knee = 1.0,
# r3lo),
# 
# compress(attack = 50., release = 200., threshold = 0.,
# ratio = 3.5, gain = -0.8, knee = 1.0,
# r6lo),
# 
# compress(attack = 50., release = 200., threshold = 0.,
# ratio = 1.0, gain = 1.0, knee = 1.0,
# r7hi, wet = 0.),
# ])
# 
# outputS = ladspa.fastlookaheadlimiter(limit=0.0, release_time=0.08, compressed)

outputS = ladspa.fastlookaheadlimiter(limit=0.0, release_time=0.08, radio)

# OUTPUT



#Output to Monkey Icecast Muxed Content

icecast_output = mksafe(buffer(outputS))
clock.assign_new(id="icecast", [icecast_output])

output.icecast(%mp3(bitrate=128, samplerate=44100),    
    host = "localhost",
    port = 8000,
    password = "icecastVPS",
    mount = icePoint,
    icy_metadata = "false",
    icecast_output)


packaged_output = mksafe(buffer(outputS))
clock.assign_new(id="packaged", [packaged_output])

  output.external(%fdkaac(channels=2, samplerate=48000, bandwidth="auto", bitrate=576, afterburner=false, transmux="adts", sbr_mode=false, aot="mpeg4_aac_lc"),
  "ffmpeglibfdk -loglevel error -re -i pipe:0 -map 0:a -map 0:a -map 0:a -var_stream_map 'a:0, a:1, a:2' -bsf:a aac_adtstoasc -hls_segment_type fmp4 -hls_fmp4_init_filename monkey_stream_%v_#{region}_init.mp4 -hls_segment_filename /monkeyMUXED/hls/data/#{region}/monkey_stream_%v_#{region}_seg-%06d.m4s -use_template 1 -use_timeline 1 -streaming 1 -hls_time 4 -hls_list_size 600 -hls_flags +delete_segments+omit_endlist+program_date_time -hls_playlist 1 -master_pl_name master.m3u8 -c:a:0 libfdk_aac -b:a:0 16k -ar:0 44100 -profile:a:0 'aac_he_v2' -c:a:1 libfdk_aac -b:a:1 64k -ar:1 44100 -profile:a:1 'aac_he' -c:a:2 copy -f hls /monkeyMUXED/hls/data/#{region}/monkey_stream_%v_#{region}.m3u8", packaged_output)



s = mksafe(playlist("playlist"))

