import React, { useRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Quote from '@editorjs/quote'
import List from '@editorjs/list'
import IncutTool from './EditorTools/incut'
import ImageTool from '@editorjs/image'
import VideoTool from '@medistream/editorjs-video'
import { IconStar } from '@codexteam/icons'
import ShowOnHomepagePlugin from './EditorTools/tunes'

const Paragraph = require('@editorjs/paragraph')
const CodeTool = require('@editorjs/code')

interface EditorProps {
  onChange: (blocks: OutputData['blocks']) => void
  initialBlocks?: OutputData['blocks']
}

const Editor: React.FC<EditorProps> = ({ onChange, initialBlocks }) => {
  const editorRef = useRef<EditorJS | null>(null)

  React.useEffect(() => {
    if (!editorRef.current?.isReady) {
      const editor = new EditorJS({
        holder: 'editor',
        minHeight: 0,
        data: {
          blocks: initialBlocks,
        },
        autofocus: true,
        placeholder: 'Введите текст вашей статьи',
        hideToolbar: false,
        tools: {
          incut: {
            class: IncutTool,
            tunes: ['anyTuneName'],
            config: {
              placeholder: 'Текст вырезки',
            },
          },
          code: {
            class: CodeTool,
            tunes: ['anyTuneName'],
            config: {
              placeholder: 'Код',
              actions: [
                {
                  name: 'show_on_homepage',
                  icon: IconStar,
                  title: 'Вывести на главную',
                  toggle: true,
                },
              ],
            },
          },
          image: {
            class: ImageTool,
            tunes: ['anyTuneName'],
            config: {
              uploader: {
                uploadByFile: async file => {
                  // Отправка файла на сервер
                  const formData = new FormData()
                  formData.append('file', file)

                  const response = await fetch('http://localhost:7777/aws', {
                    method: 'POST',
                    body: formData,
                  })

                  if (response.ok) {
                    // Получение URL загруженного изображения
                    const data = await response.json()

                    // Получение ширины и высоты изображения
                    const image = new Image()
                    image.src = data.url

                    return new Promise((resolve, reject) => {
                      image.onload = () => {
                        // Отправка данных о загруженном изображении обратно в Editor.js
                        resolve({
                          success: 1,
                          file: {
                            url: data.url,
                            width: image.width,
                            height: image.height,
                          },
                        })
                      }
                      image.onerror = () => {
                        console.error('Ошибка при загрузке изображения')
                        reject({
                          success: 0,
                        })
                      }
                    })
                  } else {
                    console.error('Ошибка при загрузке изображения')
                    return {
                      success: 0,
                    }
                  }
                },
              },
            },
          },
          video: {
            class: VideoTool,
            tunes: ['anyTuneName'],
            config: {
              uploader: {
                uploadByFile: async file => {
                  // Отправка файла на сервер
                  const formData = new FormData()
                  formData.append('file', file)

                  const response = await fetch('http://localhost:7777/aws', {
                    method: 'POST',
                    body: formData,
                  })

                  if (response.ok) {
                    // Получение URL загруженного видео
                    const data = await response.json()
                    console.log(data) // Вывод ответа сервера в консоль

                    // Получение ширины и высоты видео
                    const video = document.createElement('video')
                    video.src = data.url

                    return new Promise((resolve, reject) => {
                      video.onloadedmetadata = () => {
                        // Отправка данных о загруженном видео в базу данных
                        // Вместо console.log() используйте код для отправки данных в базу данных

                        // Отправка данных о загруженном видео обратно в Editor.js
                        resolve({
                          success: 1,
                          file: {
                            url: data.url,
                            width: video.videoWidth,
                            height: video.videoHeight,
                          },
                          autoplay: true, // Включение автовоспроизведения
                          controls: false, // Удаление элементов управления
                        })
                      }
                      video.onerror = () => {
                        console.error('Ошибка при загрузке видео')
                        reject({
                          success: 0,
                        })
                      }
                    })
                  } else {
                    console.error('Ошибка при загрузке видео')
                    return {
                      success: 0,
                    }
                  }
                },
              },
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            tunes: ['anyTuneName'],
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            tunes: ['anyTuneName'],
          },
          list: {
            class: List,
            tunes: ['anyTuneName'],
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          anyTuneName: {
            class: ShowOnHomepagePlugin,
          },
        },

        i18n: {
          messages: {
            toolNames: {
              Code: 'Код',
              Incut: 'Вырезка',
            },
            tools: {
              // Section for passing translations to the external tools classes
              // The first-level keys of this object should be equal of keys ot the 'tools' property of EditorConfig
            },
            blockTunes: {
              // Section allows to translate Block Tunes
            },
          },
        },

        onChange: async () => {
          if (editorRef.current) {
            const savedData = await editorRef.current.save()
            onChange(savedData.blocks)
          }
        },
      })

      editorRef.current = editor
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
      }
    }
  }, [])

  return <div id='editor' ref={editorRef} />
}

export default Editor
