import React from 'react';
import {Button, Input} from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import Form from 'components/form';
import Toast from 'components/toast';
import 'components/edit_meta.scss';
import _ from 'lodash';

const BAD_META = 'Looks like your meta input has duplicate keys. Make sure you get rid of them.';

/**
* Generates a reusable metadata component.
* The metadata to be displayed should be passed in as data prop to this component.
* At any point the data of this component can be
* accessed by providing a ref during the time of creation and by
* calling the getMeta() function of this component (like this.refs.metaRef.getMeta())
*/
class EditMeta extends React.Component {
    constructor(props) {
        super();
        this.state = {meta: props.data};
        this.state.arrayMeta = this.createArrayMeta(props.data);
        this.getMeta = this.getMeta.bind(this);
        this.validateKey = this.validateKey.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var arrayMeta = this.createArrayMeta(nextProps.data);
        this.setState({meta: nextProps.data, arrayMeta: arrayMeta});
    }

    createArrayMeta(data) {
        var arrayMeta;
        var index = 0;
        if (!data || data.length === 0) {
            return [];
        }

        arrayMeta = _.map(data, function (value, key) {
            var metaEntry = {key: key, value: value, index: index++};
            var tags;
            if (_.isArray(value)) {
                metaEntry.listMeta = true;
                tags = _.map(value, function (item, id) {
                    return ({id: id + 1, text: item});
                });
                metaEntry.tags = tags;
            }
            return (metaEntry);
        });
        return arrayMeta;
    }

    validateKey(value) {
        var count = 0;

        _.each(this.state.arrayMeta, function (item) {
            if (item.key === value) {
                count++;
            }
        });

        if (count > 1) {
            return 'error';
        }

        return 'success';
    }

    handleDelete(i) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        var tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    renderMetaField(value, key) {
        var valueDisplay;

        valueDisplay = <Input
                            type="text"
                            ref="valueInput"
                            name="metaValue"
                            value={value.value}
                            placeholder="meta-value"
                            onChange={(e) => {
                                var arrayMeta = this.state.arrayMeta;
                                _.each(arrayMeta, function (item, i) {
                                    if (arrayMeta[i].key === value.key &&
                                        value.index === arrayMeta[i].index
                                    ) {
                                        if (_.has(arrayMeta[i], 'asMutable')) {
                                            arrayMeta[i] = arrayMeta[i].asMutable();
                                        }
                                        arrayMeta[i].value = e.target.value;
                                        return false;
                                    }
                                });
                                this.setState({arrayMeta: arrayMeta});
                            }}
                        />;
        if (value.listMeta) {
            valueDisplay = <ReactTags tags={value.tags}
                            handleDelete={(n) => {
                                var arrayMeta = this.state.arrayMeta;
                                _.each(arrayMeta, function (item, i) {
                                    if (arrayMeta[i].key === value.key &&
                                        arrayMeta[i].index === value.index
                                    ) {
                                        if (!arrayMeta[i].listMeta) {
                                            return false;
                                        }
                                        arrayMeta[i].tags.splice(n, 1);
                                        return false;
                                    }
                                });
                                this.setState({arrayMeta: arrayMeta});
                            }}
                            handleAddition={(tag) => {
                                var arrayMeta = this.state.arrayMeta;
                                _.each(arrayMeta, function (item, i) {
                                    if (arrayMeta[i].key === value.key &&
                                        arrayMeta[i].index === value.index
                                    ) {
                                        if (!arrayMeta[i].listMeta) {
                                            return false;
                                        }
                                        arrayMeta[i].tags.push({
                                            id: arrayMeta[i].tags.length + 1,
                                            text: tag
                                        });
                                        return false;
                                    }
                                });
                                this.setState({arrayMeta: arrayMeta});
                            }} />;
        }
        return (
            <div key={key} className="meta-div">
                <div className="left-input">
                    <Form ref={key}>
                        <Input
                            type="text"
                            name="metaKey"
                            value={value.key}
                            ref="keyInput"
                            placeholder="meta-key"
                            validate={this.validateKey}
                            validationEvent="onBlur"
                            errorMessage="required"
                            hasFeedback
                            onChange={(e) => {
                                var arrayMeta = this.state.arrayMeta;
                                _.each(arrayMeta, function (item, i) {
                                    if (item.key === value.key && value.index === item.index) {
                                        if (_.has(arrayMeta[i], 'asMutable')) {
                                            arrayMeta[i] = arrayMeta[i].asMutable();
                                        }
                                        arrayMeta[i].key = e.target.value;
                                        return false;
                                    }
                                });
                                this.setState({arrayMeta: arrayMeta});
                            }}
                        />

                    </Form>
                </div>
                <div className="right-input">
                    {valueDisplay}
                </div>
                <Button onClick={() => {
                    var arrayMeta = this.state.arrayMeta;
                    _.each(arrayMeta, function (item, i) {
                        if (arrayMeta[i].key === value.key && arrayMeta[i].index === value.index) {
                            arrayMeta.splice(i, 1);
                            return false;
                        }
                    });
                    this.setState({arrayMeta: arrayMeta});
                }}>
                    delete
                </Button>
            </div>
        );
    }

    getMeta(){
        var meta = {};
        var isValid;

        if (this.state.arrayMeta.length === 0) {
            return (meta);
        }

        isValid = _.map(this.refs, function (ref) {
            if (_.has(ref, 'isValid')) {
                return ref.isValid();
            }
            return true;
        });

        if (_.includes(isValid, false)) {
            Toast.error(BAD_META);
            return 'forbid_submit';
        }
        _.each(this.state.arrayMeta, function (value) {
            if (value.key === '') {
                return;
            }
            if (!value.listMeta) {
                meta[value.key] = value.value;
                return;
            }

            if (!value.tags || value.tags.length === 0) {
                meta[value.key] = [];
                return;
            }

            meta[value.key] = _.map(value.tags, function (tag) {
                return (tag.text);
            });
        });
        return (meta);
    }

    render() {
        var metaFields;

        if (!this.state.meta) return null;

        metaFields = _.map(this.state.arrayMeta, function (value, key) {
            return (this.renderMetaField(value, key));
        }.bind(this));

        return (
            <div className="meta-table">
                <label className="control-label">
                    Meta:
                </label>
                {metaFields}
                <br/><br/>
                <div className="add-meta">
                    <Button onClick={() => {
                        var arrayMeta = this.state.arrayMeta;
                        arrayMeta.push({key: '', value: '', index: this.state.arrayMeta.length});
                        this.setState({arrayMeta: arrayMeta});
                    }}>Add Meta</Button>
                    <Button onClick={() => {
                        var arrayMeta = this.state.arrayMeta;
                        arrayMeta.push({
                            key: '',
                            value: '',
                            index: this.state.arrayMeta.length,
                            listMeta: true,
                            tags: []
                        });
                        this.setState({arrayMeta: arrayMeta});
                    }}>Add List Meta</Button><br/><br/>
                </div>
            </div>);
    }
}


export default EditMeta;
