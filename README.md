# Rejig.Processing

A Node.js package for processing workflows in browser and Lambda.

## Examples

Rejig takes workflows of type `Workflow` and processes them to generate an image, which is returned as a `string` in Base64 format.

Some examples of valid workflows:

### Minimal workflow

#### Output

![Minimal workflow output image](https://github.com/Cryptacular/Rejig.Processing/blob/master/images/sample-workflow-minimal.png)

<!-- start-minimal-workflow -->

#### JSON

```json
{
  "name": "sample-workflow-minimal",
  "size": {
    "width": 75,
    "height": 50
  },
  "layers": [
    {
      "content": {
        "type": "solid",
        "color": {
          "r": 122,
          "g": 0,
          "b": 122,
          "a": 1
        }
      }
    }
  ]
}
```

#### YAML

```yaml
name: sample-workflow-minimal
size:
  width: 75
  height: 50
layers:
  - content:
      type: solid
      color:
        r: 122
        g: 0
        b: 122
        a: 1
```

<!-- end-minimal-workflow -->

### Complex workflow

#### Output

![Complex workflow output image](https://github.com/Cryptacular/Rejig.Processing/blob/master/images/sample-workflow-complex.png)

(Photo by [Karim MANJRA](https://unsplash.com/@karim_manjra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/twist?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

<!-- start-complex-workflow -->

#### JSON

```json
{
  "id": "43c2f6b1-b975-4010-81c2-de7e28192cd1",
  "name": "sample-workflow-complex",
  "authorId": "user123",
  "size": {
    "width": 150,
    "height": 150
  },
  "layers": [
    {
      "id": "layer-with-mask",
      "content": {
        "type": "solid",
        "color": {
          "r": 255,
          "g": 255,
          "b": 255,
          "a": 1
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
        "descriptor": "center center"
      },
      "placement": "cover",
      "mask": {
        "content": {
          "type": "image",
          "location": "https://images.unsplash.com/photo-1531979089097-fe46b4e4f235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2658&q=80"
        },
        "placement": "cover",
        "origin": {
          "descriptor": "center center"
        },
        "alignment": {
          "descriptor": "center center"
        }
      },
      "blendingMode": "hardlight"
    },
    {
      "id": "layer-with-solid-color-1",
      "name": "Overlay",
      "content": {
        "type": "solid",
        "color": {
          "r": 122,
          "g": 122,
          "b": 255,
          "a": 1
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
        "x": 1,
        "y": 1
      },
      "opacity": 15
    },
    {
      "id": "layer-with-solid-color-2",
      "name": "Overlay",
      "content": {
        "type": "solid",
        "color": {
          "r": 255,
          "g": 122,
          "b": 122,
          "a": 1
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
        "descriptor": "top left"
      },
      "placement": "cover",
      "scale": {
        "x": 1,
        "y": 1
      },
      "opacity": 85,
      "blendingMode": "overlay"
    },
    {
      "id": "layer-with-solid-color-3",
      "name": "Overlay",
      "content": {
        "type": "solid",
        "color": {
          "r": 255,
          "g": 122,
          "b": 255,
          "a": 1
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
        "descriptor": "top right"
      },
      "placement": "cover",
      "scale": {
        "x": 1,
        "y": 1
      },
      "opacity": 15
    },
    {
      "id": "layer-with-solid-color-4",
      "name": "Overlay",
      "content": {
        "type": "solid",
        "color": {
          "r": 122,
          "g": 255,
          "b": 122,
          "a": 1
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
        "descriptor": "bottom left"
      },
      "placement": "cover",
      "scale": {
        "x": 1,
        "y": 1
      },
      "opacity": 15
    },
    {
      "id": "layer-with-image",
      "name": "Background image",
      "content": {
        "type": "image",
        "location": "https://images.unsplash.com/photo-1541513161836-e2049e89afaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHR3aXN0fGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
      },
      "position": {
        "x": 0,
        "y": 0
      },
      "origin": {
        "descriptor": "center center"
      },
      "alignment": {
        "descriptor": "center center"
      },
      "placement": "fit",
      "scale": {
        "x": 1,
        "y": 1
      },
      "opacity": 100
    },
    {
      "id": "layer-with-gradient",
      "name": "Linear gradient",
      "content": {
        "type": "gradient",
        "color": {
          "from": {
            "r": 255,
            "g": 255,
            "b": 255,
            "a": 1
          },
          "to": {
            "r": 20,
            "g": 0,
            "b": 0,
            "a": 1
          }
        },
        "pos": {
          "from": {
            "x": 150,
            "y": 150
          },
          "to": {
            "x": 0,
            "y": 0
          }
        }
      }
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

#### YAML

```yaml
id: 43c2f6b1-b975-4010-81c2-de7e28192cd1
name: sample-workflow-complex
authorId: user123
size:
  width: 150
  height: 150
layers:
  - id: layer-with-mask
    content:
      type: solid
      color:
        r: 255
        g: 255
        b: 255
        a: 1
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: center center
    placement: cover
    mask:
      content:
        type: image
        location: >-
          https://images.unsplash.com/photo-1531979089097-fe46b4e4f235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2658&q=80
      placement: cover
      origin:
        descriptor: center center
      alignment:
        descriptor: center center
    blendingMode: hardlight
  - id: layer-with-solid-color-1
    name: Overlay
    content:
      type: solid
      color:
        r: 122
        g: 122
        b: 255
        a: 1
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: bottom right
    placement: cover
    scale:
      x: 1
      'y': 1
    opacity: 15
  - id: layer-with-solid-color-2
    name: Overlay
    content:
      type: solid
      color:
        r: 255
        g: 122
        b: 122
        a: 1
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: top left
    placement: cover
    scale:
      x: 1
      'y': 1
    opacity: 85
    blendingMode: overlay
  - id: layer-with-solid-color-3
    name: Overlay
    content:
      type: solid
      color:
        r: 255
        g: 122
        b: 255
        a: 1
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: top right
    placement: cover
    scale:
      x: 1
      'y': 1
    opacity: 15
  - id: layer-with-solid-color-4
    name: Overlay
    content:
      type: solid
      color:
        r: 122
        g: 255
        b: 122
        a: 1
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: bottom left
    placement: cover
    scale:
      x: 1
      'y': 1
    opacity: 15
  - id: layer-with-image
    name: Background image
    content:
      type: image
      location: >-
        https://images.unsplash.com/photo-1541513161836-e2049e89afaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHR3aXN0fGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60
    position:
      x: 0
      'y': 0
    origin:
      descriptor: center center
    alignment:
      descriptor: center center
    placement: fit
    scale:
      x: 1
      'y': 1
    opacity: 100
  - id: layer-with-gradient
    name: Linear gradient
    content:
      type: gradient
      color:
        from:
          r: 255
          g: 255
          b: 255
          a: 1
        to:
          r: 20
          g: 0
          b: 0
          a: 1
      pos:
        from:
          x: 150
          'y': 150
        to:
          x: 0
          'y': 0
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
