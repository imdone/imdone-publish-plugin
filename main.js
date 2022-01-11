import _path from 'path'
import Plugin from 'imdone-api'
import {Settings, ArrayProperty, StringProperty} from 'imdone-api/lib/settings'
import {Ecto} from 'Ecto'
import {decode} from 'html-entities'
import fs from 'fs'

export default class PublishPlugin extends Plugin {
  
  constructor (project) {
    super(project)
    this.ecto = new Ecto()
    this.defaultTemplate = {
      name: 'basic board',
      path: _path.join('.imdone','plugins','imdone-publish-plugin','basic-board.njk')
    }
  }
  
  getBoardActions () {
    const project = this.project
    const templates = this.getSettings().templates || []
    return [this.defaultTemplate, ...templates].map(({name, path}) => {
      return {
        name: `Copy ${name} to clipboard`,
        action: () => {
          (async () => {
            const filePath = _path.join(this.project.path, path)
            const engineName = this.ecto.getEngineByFilePath(filePath)
            try {
              const source = await fs.promises.readFile(filePath, "utf8")
              const content = await this.ecto.render(source, {path: this.project.path, lists: this.project.lists}, engineName)
              this.project.copyToClipboard(decode(content), `${name} copied to clipboard!`)
            } catch (err) {
              console.log(`Error copying ${name} to clipboard`, err)
            }
          })()
        }
      }
    })
  }

  getSettingsSchema () {
    if (!this.settingSchema) {
      this.settingSchema = new Settings()
        .addProperty(
          'templates',
          new ArrayProperty()
            .itemsDraggable(true)
            .setTitle('Templates')
            .setDescription('Templates for copying current board.')
            .itemTitle('Template')
            .addItemProperty('name', new StringProperty().setTitle('Name'))
            .addItemProperty('path', new StringProperty().setTitle('Path'))
        )
    }
    return this.settingSchema
  }
}
