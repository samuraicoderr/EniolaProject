# About

# Generate

---

## 1. Calling the API

### Install the client

The client provides a convenient way to interact with the model API.

```bash
pip install fal-client
```

### Setup your API Key

Set `FAL_KEY` as an environment variable in your runtime.

```bash
export FAL_KEY="YOUR_API_KEY"
```

### Submit a request

The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.

**Python**

**Python (async)**

```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/chatterbox/text-to-speech",
    arguments={
        "text": "I just found a hidden treasure in the backyard! Check it out!"
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
```

---

## 2. Authentication

The API uses an API Key for authentication. It is recommended you set the `FAL_KEY` environment variable in your runtime when possible.

### API Key

**Protect your API Key**

When running code on the client-side (e.g. in a browser, mobile app or GUI applications), make sure to not expose your `FAL_KEY`. Instead, use a server-side proxy to make requests to the API. For more information, check out our server-side integration guide.

---

## 3. Queue

### Long-running requests

For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the Queue status and rely on Webhooks instead of blocking while waiting for the result.

### Submit a request

The client API provides a convenient way to submit requests to the model.

**Python**

**Python (async)**

```python
import fal_client

handler = fal_client.submit(
    "fal-ai/chatterbox/text-to-speech",
    arguments={
        "text": "I just found a hidden treasure in the backyard! Check it out!"
    },
    webhook_url="https://optional.webhook.url/for/results",
)

request_id = handler.request_id
```

### Fetch request status

You can fetch the status of a request to check if it is completed or still in progress.

**Python**

**Python (async)**

```python
status = fal_client.status("fal-ai/chatterbox/text-to-speech", request_id, with_logs=True)
```

### Get the result

Once the request is completed, you can fetch the result. See the Output Schema for the expected result format.

**Python**

**Python (async)**

```python
result = fal_client.result("fal-ai/chatterbox/text-to-speech", request_id)
```

---

## 4. Files

Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

### Data URI (base64)

You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

### Hosted files (URL)

You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

### Uploading files

We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.

**Python**

**Python (async)**

```python
url = fal_client.upload_file("path/to/file")
```

Read more about file handling in our file upload guide.

---

## 5. Schema

### Input

**text** `string`  
The text to be converted to speech (maximum 5000 characters). You can additionally add the following emotive tags:  
`<laugh>`, `<chuckle>`, `<sigh>`, `<cough>`, `<sniffle>`, `<groan>`, `<yawn>`, `<gasp>`

**audio_url** `string`  
Optional URL to an audio file to use as a reference for the generated speech. If provided, the model will try to match the style and tone of the reference audio.  
Default value:  
`https://storage.googleapis.com/chatterbox-demo-samples/prompts/male_rickmorty.mp3`

**exaggeration** `float`  
Exaggeration factor for the generated speech (0.0 = no exaggeration, 1.0 = maximum exaggeration).  
Default value: `0.25`

**temperature** `float`  
Temperature for generation (higher = more creative).  
Default value: `0.7`

**cfg** `float`  
Default value: `0.5`

**seed** `integer`  
Useful to control the reproducibility of the generated audio. Assuming all other properties didn't change, a fixed seed should always generate the exact same audio file. Set to `0` for random seed.

```json
{
  "text": "I just found a hidden treasure in the backyard! Check it out!",
  "audio_url": "https://storage.googleapis.com/chatterbox-demo-samples/prompts/male_rickmorty.mp3",
  "exaggeration": 0.25,
  "temperature": 0.7,
  "cfg": 0.5
}
```

---

### Output

**audio** `File`  
The generated speech audio

```json
{
  "audio": {
    "url": "https://v3.fal.media/files/kangaroo/RQ_pxc7oPdueYqWUqEbPE_tmpjnzvvzx_.wav"
  }
}
```

---

## Other types

### ChatterboxTurboRequest

**text** `string`  
The text to be converted to speech (maximum 5000 characters). You can add paralinguistic tags:  
`[clear throat]`, `[sigh]`, `[shush]`, `[cough]`, `[groan]`, `[sniff]`, `[gasp]`, `[chuckle]`, `[laugh]`

**voice** `string`  
Preset voice to use for synthesis. Choose from available voices or provide a custom audio URL.  
Default value: `"lucy"`

**audio_url** `string`  
Optional URL to a custom audio file (5-10 seconds) for voice cloning. If provided, this overrides the preset voice selection.

**temperature** `float`  
Temperature for generation. Higher values create more varied speech patterns.  
Default value: `0.8`

**seed** `integer`  
Random seed for reproducible results. Set to `0` for random generation.

---

### ChatterboxVCRequest

**source_audio_url** `string`  

**target_voice_audio_url** `string`  
Required URL to an audio file to use as the target reference voice for speech-to-speech voice conversion.

---

### File

**url** `string`  
The URL where the file can be downloaded from.

**content_type** `string`  
The mime type of the file.

**file_name** `string`  
The name of the file. It will be auto-generated if not provided.

**file_size** `integer`  
The size of the file in bytes.

---

### ChatterboxMultilingualRequest

**text** `string`  
The text to be converted to speech (maximum 300 characters). Supports 23 languages including English, French, German, Spanish, Italian, Portuguese, Hindi, Arabic, Chinese, Japanese, Korean, and more.

**voice** `string`  
Language code for synthesis. In case using custom please provide audio url and select `custom_audio_language`.  
Default value: `"english"`

**custom_audio_language** `Enum`  
If using a custom audio URL, specify the language of the audio here. Ignored if voice is not a custom url.

Possible enum values:  
`english`, `arabic`, `danish`, `german`, `greek`, `spanish`, `finnish`, `french`, `hebrew`, `hindi`, `italian`, `japanese`, `korean`, `malay`, `dutch`, `norwegian`, `polish`, `portuguese`, `russian`, `swedish`, `swahili`, `turkish`, `chinese`

**exaggeration** `float`  
Controls speech expressiveness and emotional intensity (0.25-2.0). 0.5 is neutral, higher values increase expressiveness. Extreme values may be unstable.  
Default value: `0.5`

**temperature** `float`  
Controls randomness and variation in generation (0.05-5.0). Higher values create more varied speech patterns.  
Default value: `0.8`

**cfg_scale** `float`  
Configuration/pace weight controlling generation guidance (0.0-1.0). Use `0.0` for language transfer to mitigate accent inheritance.  
Default value: `0.5`

**seed** `integer`  
Random seed for reproducible results. Set to `0` for random generation, or provide a specific number for consistent outputs.

---

## Related Models
