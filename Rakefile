task :default => [:build]

task :build do
  src_files = Dir["source/*.coffee"]
  sh "coffee", "-bcj", "public/main.js", *src_files

  %w[
    editor
    slicer
    tiler
  ].each do |subdir|
    src_files = Dir["source/#{subdir}/*.coffee"]
    sh "coffee", "-bcj", "public/#{subdir}.js", *src_files
  end

  sh "cat source/*.styl | stylus > public/main.css"
end
