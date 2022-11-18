# Rejig.Processing

A Node.js package for processing workflows in browser and Lambda.

## Examples

Rejig takes workflows of type `Workflow` and processes them to generate an image, which is returned as a `string` in Base64 format.

Some examples of valid workflows:

### Minimal workflow

<!-- start-minimal-workflow -->

JSON:

```json
{
  "size": {
    "width": 1920,
    "height": 1080
  }
}
```

YAML:

```yaml
size:
  width: 1920
  height: 1080
```

<!-- end-minimal-workflow -->

### Complex workflow

<!-- start-complex-workflow -->

JSON:

```json
{
  "id": "43c2f6b1-b975-4010-81c2-de7e28192cd1",
  "name": "my-custom-workflow",
  "authorId": "user123",
  "size": {
    "width": 1920,
    "height": 1080
  },
  "layers": [
    {
      "id": "layer-with-solid-color",
      "name": "Overlay",
      "content": {
        "type": "solid",
        "color": {
          "r": 122,
          "g": 122,
          "b": 255,
          "a": 255
        }
      },
      "position": {
        "x": 0,
        "y": 0
      },
      "origin": {
        "descriptor": "center center"
      },
      "alignment": {
        "descriptor": "bottom right"
      },
      "placement": "cover",
      "scale": {
        "x": 100,
        "y": 100
      },
      "opacity": 15
    },
    {
      "id": "layer-with-image",
      "name": "Background image",
      "content": {
        "type": "image",
        "location": "https://url/to/an/image.jpg"
      },
      "position": {
        "x": 0,
        "y": 0
      },
      "origin": {
        "descriptor": "center center"
      },
      "alignment": {
        "descriptor": "bottom right"
      },
      "placement": "cover",
      "scale": {
        "x": 100,
        "y": 100
      },
      "opacity": 100
    }
  ],
  "parameters": [
    {
      "id": "background",
      "name": "Background",
      "targetLayer": "layer-with-image",
      "targetProperty": "content.location"
    }
  ],
  "remixedFrom": "30013602-d2ed-4599-921f-5918611b6236",
  "created": "2022-12-17T21:34:04.000Z",
  "modified": "2022-12-17T22:12:13.000Z"
}
```

YAML:

```yaml
id: 43c2f6b1-b975-4010-81c2-de7e28192cd1
name: my-custom-workflow
authorId: user123
size:
  width: 1920
  height: 1080
layers:
  - id: layer-with-solid-color
    name: Overlay
    content:
      type: solid
      color:
        r: 122
        g: 122
        b: 255
        a: 255
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: bottom right
    placement: cover
    scale:
      x: 100
      'y': 100
    opacity: 15
  - id: layer-with-image
    name: Background image
    content:
      type: image
      location: https://url/to/an/image.jpg
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: bottom right
    placement: cover
    scale:
      x: 100
      'y': 100
    opacity: 100
parameters:
  - id: background
    name: Background
    targetLayer: layer-with-image
    targetProperty: content.location
remixedFrom: 30013602-d2ed-4599-921f-5918611b6236
created: 2022-12-17T21:34:04.000Z
modified: 2022-12-17T22:12:13.000Z
```

<!-- end-complex-workflow -->
