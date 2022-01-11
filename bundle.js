'use strict';

var _path = require('path');
var Plugin = require('imdone-api');
var settings = require('imdone-api/lib/settings');
var Ecto = require('Ecto');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _path__default = /*#__PURE__*/_interopDefaultLegacy(_path);
var Plugin__default = /*#__PURE__*/_interopDefaultLegacy(Plugin);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

class PublishPlugin extends Plugin__default["default"] {
  
  constructor (project) {
    super(project);
    this.ecto = new Ecto.Ecto();
    this.defaultTemplate = {
      name: 'basic board',
      path: _path__default["default"].join('.imdone','plugins','imdone-publish-plugin','basic-board.mustache')
    };
  }
  
  getBoardActions () {
    this.project;
    const templates = this.getSettings().templates || [];
    return [this.defaultTemplate, ...templates].map(({name, path}) => {
      return {
        name: `Copy ${name} to clipboard`,
        action: () => {
          (async () => {
            const filePath = _path__default["default"].join(this.project.path, path);
            const engineName = this.ecto.getEngineByFilePath(filePath);
            try {
              const source = await fs__default["default"].promises.readFile(filePath, "utf8");
              const content = await this.ecto.render(source, {path: this.project.path, lists: this.project.lists}, engineName);
              this.project.copyToClipboard(content, `${name} copied to clipboard!`);
            } catch (err) {
              console.log(`Error copying ${name} to clipboard`, err);
            }
          })();
        }
      }
    })
  }

  getSettingsSchema () {
    if (!this.settingSchema) {
      this.settingSchema = new settings.Settings()
        .addProperty(
          'templates',
          new settings.ArrayProperty()
            .itemsDraggable(true)
            .setTitle('Templates')
            .setDescription('Add mustache templates')
            .itemTitle('Template')
            .addItemProperty('name', new settings.StringProperty().setTitle('Name'))
            .addItemProperty('path', new settings.StringProperty().setTitle('Path'))
        );
    }
    return this.settingSchema
  }
}

module.exports = PublishPlugin;
