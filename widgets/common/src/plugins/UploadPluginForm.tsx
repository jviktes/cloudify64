// @ts-nocheck File not migrated fully to TS

const placeholders = {
    wagon: "Provide the plugin's wagon file URL or click browse to select a file",
    yaml: "Provide the plugin's YAML file URL or click browse to select a file",
    title: "Provide the plugin's title",
    icon: "Provide the plugin's icon file URL or click browse to select a file"
};

class UploadPluginForm extends React.Component {
    static NO_ERRORS = { errors: {} };

    constructor(props) {
        super(props);
        this.state = { title: '' };
    }

    componentDidMount() {
        const { onChange: cbOnChange } = this.props;
        cbOnChange(UploadPluginForm.NO_ERRORS);
    }

    onChange(field, file, url) {
        const { onChange: cbOnChange } = this.props;
        cbOnChange({
            ...UploadPluginForm.NO_ERRORS,
            [`${field}File`]: file,
            [`${field}Url`]: url
        });
    }

    createUrlOrFileFormField(field, required, onChangeUrl = _.noop, onChangeFile = _.noop, onBlurUrl) {
        const { errors, hidePlaceholders } = this.props;
        const { Form } = Stage.Basic;
        const fieldName = field.toLowerCase();
        const urlProp = `${fieldName}Url`;
        return (
            <Form.Field label={`${field} file`} required={required} key={field} error={errors[urlProp]}>
                <Form.UrlOrFile
                    name={fieldName}
                    value={urlProp}
                    placeholder={hidePlaceholders ? '' : placeholders[fieldName]}
                    onChangeUrl={url => {
                        this.onChange(fieldName, null, url);
                        onChangeUrl(url);
                    }}
                    onChangeFile={file => {
                        this.onChange(fieldName, file || null, file ? file.name : '');
                        onChangeFile(file);
                    }}
                    onBlurUrl={onBlurUrl}
                />
            </Form.Field>
        );
    }

    render() {
        const { addRequiredMarks, errors, hidePlaceholders, toolbox } = this.props;
        const { loading, title } = this.state;
        const { Form, LoadingOverlay } = Stage.Basic;

        const onTitleChange = titleChange => {
            const { onChange } = this.props;
            onChange({
                ...UploadPluginForm.NO_ERRORS,
                ...titleChange
            });
            this.setState(titleChange);
        };

        const formFields = [
            this.createUrlOrFileFormField('Wagon', addRequiredMarks),
            this.createUrlOrFileFormField(
                'YAML',
                addRequiredMarks,
                pluginYamlUrl => this.setState({ pluginYamlUrl }),
                pluginYamlFile => {
                    if (pluginYamlFile && !title) {
                        this.setState({ loading: true });
                        toolbox
                            .getInternal()
                            .doUpload('/plugins/title', { files: { yaml_file: pluginYamlFile } })
                            .then(onTitleChange)
                            .finally(() => this.setState({ loading: false }));
                    }
                },
                () => {
                    const { pluginYamlUrl } = this.state;
                    if (pluginYamlUrl && !title) {
                        this.setState({ loading: true });
                        toolbox
                            .getInternal()
                            .doPut('/plugins/title', { params: { yamlUrl: pluginYamlUrl } })
                            .then(onTitleChange)
                            .finally(() => this.setState({ loading: false }));
                    }
                }
            ),
            <Form.Field label="Plugin title" required={addRequiredMarks} key="title" error={errors.title}>
                <Form.Input
                    name="title"
                    value={title}
                    placeholder={hidePlaceholders ? '' : placeholders.title}
                    onChange={(e, { value }) => onTitleChange({ title: value })}
                />
            </Form.Field>,
            this.createUrlOrFileFormField('Icon', false)
        ];

        return (
            <>
                {loading && <LoadingOverlay />}
                {formFields}
            </>
        );
    }
}

UploadPluginForm.propTypes = {
    errors: PropTypes.shape({ title: PropTypes.string }),
    onChange: PropTypes.func.isRequired,
    addRequiredMarks: PropTypes.bool,
    hidePlaceholders: PropTypes.bool,
    toolbox: PropTypes.shape({ getInternal: PropTypes.func }).isRequired
};

UploadPluginForm.defaultProps = {
    hidePlaceholders: false,
    errors: {},
    addRequiredMarks: true
};

export default UploadPluginForm;
