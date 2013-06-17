require "coffee-script"
require "digest/sha1"
require "haml"
require "fog"
require "pry" if ENV["RACK_ENV"] == "development"
require "sinatra"
require "tempfile"

configure do
  storage = Fog::Storage.new({
    :provider => 'AWS',
    :aws_access_key_id => ENV["ACCESS_KEY_ID"],
    :aws_secret_access_key => ENV["SECRET_ACCESS_KEY"],
  })

  set :bucket, ENV["AWS_BUCKET"]

  set :storage, storage
end

get "/" do
  haml :index
end

get "/upload" do
  haml :upload
end

post "/upload" do
  if data = params[:data]
    file = data[:tempfile]
    content_type = data[:type]
  elsif data = params[:data_base64]
    content_type = params[:type]
    file = Tempfile.new ["image", ".png"], :encoding => 'ascii-8bit'
    file.write Base64.decode64(data)
    file.rewind
  else
    return 400
  end

  store(file, content_type)

  200
end

def directory
  settings.storage.directories.get(settings.bucket)
end

def store(file, content_type=nil)
  sha1 = Digest::SHA1.file(file.path).hexdigest

  if directory.files.get(sha1)
    # Already stored, do nothing
  else
    directory.files.create(
      :key => sha1,
      :body => file,
      :content_type => content_type,
      :public => true,
    )
  end
end

__END__
@@layout
!!!
%html
  %head
    %meta(charset="utf-8")

    %link(rel="stylesheet" type="text/css" href="/application.css")

    %script(src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js")
    %script(src="/jquery.gritter.min.js")
    %script(src="/sha1.js")
    %script(src="/enc-base64-min.js")
    %script(src="/application.js")

  %body
    = yield

@@upload
%form(method="POST" enctype="multipart/form-data")
  %input(type="file" name="data")
  %button Submit

@@index

:coffeescript
  displaySaved = (sha, imgData) ->
    if imgData
      url = "data:image/png;base64,\#{imgData}"
    else
      n = Math.floor(parseInt(sha.substring(0, 1), 16) / 4)
      # url = "http://a\#{n}.pixiecdn.com/\#{sha}?\#{escape(location.origin)}"
      url = "https://s3.amazonaws.com/addressable/\#{sha}"

    $.gritter.add
      title: ''
      text: ''
      image: url
      time: ''
      sticky: true

  try
    if appData = JSON.parse(localStorage.pixieData)
      appData.each (datum) ->
        displaySaved(datum)
    else
      appData = []
  catch e
    appData = []

  _canvas = null

  $ ->
    $(document).on "click", ".gritter-item", ->
      src = $(this).find("img").attr("src")
      _canvas.fromDataURL(src)

    pixelEditor = Pixie.Editor.Pixel.create
      width: 32
      height: 32
      initializer: (canvas) ->
        _canvas = canvas

        canvas.addAction
          name: "download"
          perform: (canvas) ->
            w = window.open()
            w.document.location = canvas.toDataURL()
          undoable: false

        canvas.addAction
          name: "save"
          perform: (canvas) ->
            data = canvas.toBase64()

            $.post '/upload',
              data_base64: data
              type: "image/png"

            raw = CryptoJS.enc.Base64.parse(data)
            sha = CryptoJS.SHA1(raw).toString()
            displaySaved(sha, data)

            # Store address locally
            appData.push(sha)
            localStorage.pixieData = JSON.stringify(appData)

          undoable: false

    pixelEditor.appendTo($('body'))
