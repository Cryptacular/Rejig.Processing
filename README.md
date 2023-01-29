# Rejig.Processing

A Node.js package for processing workflows in browser and Lambda.

## Examples

Rejig takes workflows of type `Workflow` and processes them to generate an image, which is returned as `Jimp` object. This can be written to disk by passing it to the `saveImage` function.

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
  "format": "jpeg",
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
      "origin": "center center",
      "alignment": "center center",
      "placement": "cover",
      "mask": {
        "content": {
          "type": "image",
          "location": "https://images.unsplash.com/photo-1531979089097-fe46b4e4f235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2658&q=80"
        },
        "placement": "cover",
        "origin": "center center",
        "alignment": "center center"
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
      "origin": "center center",
      "alignment": "bottom right",
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
      "origin": "center center",
      "alignment": "top left",
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
      "origin": "center center",
      "alignment": "top right",
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
      "origin": "center center",
      "alignment": "bottom left",
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
      "origin": "center center",
      "alignment": "center center",
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
format: jpeg
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
    origin: center center
    alignment: center center
    placement: cover
    mask:
      content:
        type: image
        location: >-
          https://images.unsplash.com/photo-1531979089097-fe46b4e4f235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2658&q=80
      placement: cover
      origin: center center
      alignment: center center
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
    origin: center center
    alignment: bottom right
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
    origin: center center
    alignment: top left
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
    origin: center center
    alignment: top right
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
    origin: center center
    alignment: bottom left
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
    origin: center center
    alignment: center center
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

## Workflow schema

The following describes the `Workflow` schema in full detail. If you are using this library in a TypeScript project, your IDE should give you some helpful hints while editing. If the object is invalid when passed to the `processWorkflow` function, it will throw an error with details on what parts of your object are invalid.

If you're working directly with JSON or YAML files, you can reference the Workflow JSON schema like this:

```json
{
  "$schema": "https://raw.githubusercontent.com/Cryptacular/Rejig.Processing/master/json-schema/workflow.json"
}
```

...or in YAML:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Cryptacular/Rejig.Processing/master/json-schema/workflow.json
```

Full schema:

<!-- start-workflow-schema -->

```json
{
  "optional": true,
  "nullable": false,
  "type": "object",
  "oneOf": [],
  "notOneOf": [],
  "tests": [],
  "fields": {
    "id": {
      "optional": true,
      "nullable": false,
      "type": "string",
      "oneOf": [],
      "notOneOf": [],
      "tests": []
    },
    "authorId": {
      "optional": true,
      "nullable": false,
      "type": "string",
      "oneOf": [],
      "notOneOf": [],
      "tests": []
    },
    "size": {
      "optional": false,
      "nullable": false,
      "type": "object",
      "oneOf": [],
      "notOneOf": [],
      "tests": [],
      "fields": {
        "width": {
          "optional": true,
          "nullable": false,
          "type": "number",
          "oneOf": [],
          "notOneOf": [],
          "tests": [
            {
              "name": "min",
              "params": {
                "min": 0
              }
            }
          ]
        },
        "height": {
          "optional": true,
          "nullable": false,
          "type": "number",
          "oneOf": [],
          "notOneOf": [],
          "tests": [
            {
              "name": "min",
              "params": {
                "min": 0
              }
            }
          ]
        }
      }
    },
    "name": {
      "optional": true,
      "nullable": false,
      "type": "string",
      "oneOf": [],
      "notOneOf": [],
      "tests": [
        {
          "name": "min",
          "params": {
            "min": 1
          }
        }
      ]
    },
    "format": {
      "optional": true,
      "nullable": false,
      "type": "string",
      "oneOf": [
        "png",
        "jpg",
        "jpeg",
        "tiff",
        "bmp"
      ],
      "notOneOf": [],
      "tests": []
    },
    "layers": {
      "optional": true,
      "nullable": false,
      "type": "array",
      "oneOf": [],
      "notOneOf": [],
      "tests": [],
      "innerType": {
        "optional": true,
        "nullable": false,
        "type": "object",
        "oneOf": [],
        "notOneOf": [],
        "tests": [],
        "fields": {
          "id": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          },
          "name": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          },
          "content": {
            "optional": true,
            "nullable": false,
            "type": "object",
            "oneOf": [],
            "notOneOf": [],
            "tests": [],
            "fields": {
              "type": {
                "optional": false,
                "nullable": false,
                "type": "string",
                "oneOf": [
                  "image",
                  "solid",
                  "gradient",
                  "workflow"
                ],
                "notOneOf": [],
                "tests": [
                  {
                    "name": "required"
                  }
                ]
              }
            }
          },
          "position": {
            "optional": true,
            "nullable": false,
            "type": "object",
            "oneOf": [],
            "notOneOf": [],
            "tests": [],
            "fields": {
              "x": {
                "optional": true,
                "nullable": false,
                "type": "number",
                "oneOf": [],
                "notOneOf": [],
                "tests": []
              },
              "y": {
                "optional": true,
                "nullable": false,
                "type": "number",
                "oneOf": [],
                "notOneOf": [],
                "tests": []
              }
            }
          },
          "origin": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [
              "top left",
              "top center",
              "top right",
              "center left",
              "center center",
              "center right",
              "bottom left",
              "bottom center",
              "bottom right"
            ],
            "notOneOf": [],
            "tests": []
          },
          "alignment": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [
              "top left",
              "top center",
              "top right",
              "center left",
              "center center",
              "center right",
              "bottom left",
              "bottom center",
              "bottom right"
            ],
            "notOneOf": [],
            "tests": []
          },
          "placement": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [
              "custom",
              "cover",
              "fit",
              "stretch"
            ],
            "notOneOf": [],
            "tests": []
          },
          "scale": {
            "optional": true,
            "nullable": false,
            "type": "object",
            "oneOf": [],
            "notOneOf": [],
            "tests": [],
            "fields": {
              "x": {
                "optional": true,
                "nullable": false,
                "type": "number",
                "oneOf": [],
                "notOneOf": [],
                "tests": []
              },
              "y": {
                "optional": true,
                "nullable": false,
                "type": "number",
                "oneOf": [],
                "notOneOf": [],
                "tests": []
              }
            }
          },
          "opacity": {
            "optional": true,
            "nullable": false,
            "type": "number",
            "oneOf": [],
            "notOneOf": [],
            "tests": [
              {
                "name": "min",
                "params": {
                  "min": 0
                }
              },
              {
                "name": "max",
                "params": {
                  "max": 100
                }
              }
            ]
          },
          "blendingMode": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [
              "normal",
              "multiply",
              "add",
              "screen",
              "overlay",
              "darken",
              "lighten",
              "hardlight",
              "difference",
              "exclusion"
            ],
            "notOneOf": [],
            "tests": []
          },
          "mask": {
            "optional": true,
            "nullable": false,
            "type": "object",
            "oneOf": [],
            "notOneOf": [],
            "tests": [],
            "fields": {
              "content": {
                "optional": true,
                "nullable": false,
                "type": "object",
                "oneOf": [],
                "notOneOf": [],
                "tests": [],
                "fields": {
                  "type": {
                    "optional": false,
                    "nullable": false,
                    "type": "string",
                    "oneOf": [
                      "image",
                      "solid",
                      "gradient",
                      "workflow"
                    ],
                    "notOneOf": [],
                    "tests": [
                      {
                        "name": "required"
                      }
                    ]
                  }
                }
              },
              "position": {
                "optional": true,
                "nullable": false,
                "type": "object",
                "oneOf": [],
                "notOneOf": [],
                "tests": [],
                "fields": {
                  "x": {
                    "optional": true,
                    "nullable": false,
                    "type": "number",
                    "oneOf": [],
                    "notOneOf": [],
                    "tests": []
                  },
                  "y": {
                    "optional": true,
                    "nullable": false,
                    "type": "number",
                    "oneOf": [],
                    "notOneOf": [],
                    "tests": []
                  }
                }
              },
              "origin": {
                "optional": true,
                "nullable": false,
                "type": "string",
                "oneOf": [
                  "top left",
                  "top center",
                  "top right",
                  "center left",
                  "center center",
                  "center right",
                  "bottom left",
                  "bottom center",
                  "bottom right"
                ],
                "notOneOf": [],
                "tests": []
              },
              "alignment": {
                "optional": true,
                "nullable": false,
                "type": "string",
                "oneOf": [
                  "top left",
                  "top center",
                  "top right",
                  "center left",
                  "center center",
                  "center right",
                  "bottom left",
                  "bottom center",
                  "bottom right"
                ],
                "notOneOf": [],
                "tests": []
              },
              "placement": {
                "optional": true,
                "nullable": false,
                "type": "string",
                "oneOf": [
                  "custom",
                  "cover",
                  "fit",
                  "stretch"
                ],
                "notOneOf": [],
                "tests": []
              },
              "scale": {
                "optional": true,
                "nullable": false,
                "type": "object",
                "oneOf": [],
                "notOneOf": [],
                "tests": [],
                "fields": {
                  "x": {
                    "optional": true,
                    "nullable": false,
                    "type": "number",
                    "oneOf": [],
                    "notOneOf": [],
                    "tests": []
                  },
                  "y": {
                    "optional": true,
                    "nullable": false,
                    "type": "number",
                    "oneOf": [],
                    "notOneOf": [],
                    "tests": []
                  }
                }
              }
            }
          },
          "clippingMask": {
            "optional": true,
            "nullable": false,
            "type": "boolean",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          }
        }
      }
    },
    "parameters": {
      "optional": true,
      "nullable": false,
      "type": "array",
      "oneOf": [],
      "notOneOf": [],
      "tests": [],
      "innerType": {
        "optional": true,
        "nullable": false,
        "type": "object",
        "oneOf": [],
        "notOneOf": [],
        "tests": [],
        "fields": {
          "id": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          },
          "name": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          },
          "targetLayer": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          },
          "targetProperty": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [
              "position",
              "origin",
              "alignment",
              "placement",
              "scale",
              "opacity",
              "content.location",
              "content.color"
            ],
            "notOneOf": [],
            "tests": []
          },
          "value": {
            "optional": true,
            "nullable": false,
            "type": "string",
            "oneOf": [],
            "notOneOf": [],
            "tests": []
          }
        }
      }
    },
    "remixedFrom": {
      "optional": true,
      "nullable": true,
      "type": "string",
      "oneOf": [],
      "notOneOf": [],
      "tests": []
    },
    "created": {
      "optional": true,
      "nullable": false,
      "type": "date",
      "oneOf": [],
      "notOneOf": [],
      "tests": []
    },
    "modified": {
      "optional": true,
      "nullable": false,
      "type": "date",
      "oneOf": [],
      "notOneOf": [],
      "tests": []
    }
  }
}```

<!-- end-workflow-schema -->
````
