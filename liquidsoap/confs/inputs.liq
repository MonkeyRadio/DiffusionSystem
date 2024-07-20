def input_auth(args) =
  ret =
    process.read.lines(
      "/scripts/auth.sh #{args.user} #{args.password}"
    )
  ret = list.hd(default="", ret)

  if ret == "true" then true else false end
end
