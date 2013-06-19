task :default => [:build]

task :build do
  src_files = Dir["source/*.coffee"]
  sh "coffee", "-bcj", "public/main.js", *src_files

  %w[
    editor
    slicer
  ].each do |subdir|
    src_files = Dir["source/#{subdir}/*.coffee"]
    sh "coffee", "-bcj", "public/#{subdir}.js", *src_files
  end

  styl_files = Dir["source/*.styl"]
  sh "stylus < #{styl_files.join(' ')} > public/main.css"
end
