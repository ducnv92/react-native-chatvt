import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CameraRoll from "./CameraRoll";
import PropTypes from 'prop-types';
import Row from './Row';

import ImageItem from './ImageItem';
import {BottomSheetFlatList} from "@gorhom/bottom-sheet";
import {Log} from "../../utils";

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  loader: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// helper functions
const arrayObjectIndexOf = (array, property, value) => array.map(o => o[property]).indexOf(value);

const nEveryRow = (data, n) => {
  const result = [];
  let temp = [];

  for (let i = 0; i < data.length; ++i) {
    if (i > 0 && i % n === 0) {
      result.push(temp);
      temp = [];
    }
    temp.push(data[i]);
  }

  if (temp.length > 0) {
    while (temp.length !== n) {
      temp.push(null);
    }
    result.push(temp);
  }

  return result;
};

class CameraRollPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      selected: this.props.selected,
      lastCursor: null,
      initialLoading: true,
      loadingMore: false,
      noMore: false,
      data: [],
    };

    this.renderFooterSpinner = this.renderFooterSpinner.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }


  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.selected!==prevState.selected){
      return { selected: nextProps.selected};
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.selected!==this.props.selected){
      //Perform some operation here
      this.setState({selected: this.props.selected});

    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     selected: nextProps.selected,
  //   });
  // }

  onEndReached() {
    if (!this.state.noMore) {
      this.fetch();
    }
  }

  appendImages(data) {
    console.log('images', data)
    const assets = data.edges;
    const newState = {
      loadingMore: false,
      initialLoading: false,
    };

    if (!data.page_info.has_next_page) {
      newState.noMore = true;
    }

    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.images = this.state.images.concat(assets);
      newState.data = nEveryRow(newState.images, this.props.imagesPerRow);
    }

    this.setState(newState);
  }

  fetch() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this.doFetch(); });
    }
  }

  convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
    const hash = localIdentifier.split('/')[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
  };

  doFetch() {
    const { groupTypes, assetType } = this.props;

    const fetchParams = {
      first: 100,
      // groupTypes,
      assetType,
    };

    if (Platform.OS === 'android') {
      // not supported in android
      delete fetchParams.groupTypes;
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams)
      .then(data => {
        data.edges.map(async (edge) => {
          if (Platform.OS === 'ios') {
            edge.node.image.uri = this.convertLocalIdentifierToAssetLibrary(edge.node.image.uri.replace('ph://', ''), edge.node.type === 'image' ? 'jpg' : 'mov')
          }
          return edge
        })
        this.appendImages(data)
      }, e => Log(e));
  }

  selectImage(image) {
    const {
      maximum, imagesPerRow, callback, selectSingleItem,
    } = this.props;

    const { selected } = this.state;
    const index = arrayObjectIndexOf(selected, 'uri', image.uri);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      if (selectSingleItem) {
        selected.splice(0, selected.length);
      }
      if (selected.length < maximum) {
        selected.push(image);
      }
    }

    this.setState({
      selected,
      data: nEveryRow(this.state.images, imagesPerRow),
    });

    callback(selected, image);
  }

  renderImage(item) {
    const { selected } = this.state;
    const {
      imageMargin,
      selectedMarker,
      imagesPerRow,
      containerWidth,
    } = this.props;

    const { uri } = item.node.image;
    const isSelected = (arrayObjectIndexOf(selected, 'uri', uri) >= 0);

    return (
      <ImageItem
        key={uri}
        item={item}
        selected={isSelected}
        imageMargin={imageMargin}
        selectedMarker={selectedMarker}
        imagesPerRow={imagesPerRow}
        containerWidth={containerWidth}
        onClick={this.selectImage}
      />
    );
  }

  renderRow(item) { // item is an array of objects
    const isSelected = item.map((imageItem) => {
      if (!imageItem) return false;
      const { uri } = imageItem.node.image;
      return arrayObjectIndexOf(this.state.selected, 'uri', uri) >= 0;
    });
    return (<Row
      rowData={item}
      isSelected={isSelected}
      selectImage={this.selectImage}
      imagesPerRow={this.props.imagesPerRow}
      containerWidth={this.props.containerWidth}
      imageMargin={this.props.imageMargin}
      selectedMarker={this.props.selectedMarker}
    />);
  }

  renderFooterSpinner() {
    if (!this.state.noMore) {
      return <ActivityIndicator style={styles.spinner} />;
    }
    return null;
  }

  render() {
    const {
      initialNumToRender,
      imageMargin,
      backgroundColor,
      emptyText,
      emptyTextStyle,
      loader,
    } = this.props;

    if (this.state.initialLoading) {
      return (
        <View style={[styles.loader, { backgroundColor }]}>
          { loader || <ActivityIndicator /> }
        </View>
      );
    }

    const flatListOrEmptyText = this.state.data.length > 0 ? (
      <BottomSheetFlatList
        style={{ paddingLeft: 4, paddingTop: 4, backgroundColor: '#1e1c1d' }}
        ListFooterComponent={this.renderFooterSpinner}
        initialNumToRender={initialNumToRender}
        onEndReached={this.onEndReached}
        renderItem={({ item }) => this.renderRow(item)}
        keyExtractor={item => item[0].node.image.uri}
        data={this.state.data}
        extraData={this.state.selected}
      />
    ) : (
      <Text style={[{ textAlign: 'center' }, emptyTextStyle]}>{emptyText}</Text>
    );

    return (
      <>
        {flatListOrEmptyText}
      </>
    );
  }
}

CameraRollPicker.propTypes = {
  initialNumToRender: PropTypes.number,
  groupTypes: PropTypes.oneOf([
    'Album',
    'All',
    'Event',
    'Faces',
    'Library',
    'PhotoStream',
    'SavedPhotos',
  ]),
  maximum: PropTypes.number,
  assetType: PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),
  selectSingleItem: PropTypes.bool,
  imagesPerRow: PropTypes.number,
  imageMargin: PropTypes.number,
  containerWidth: PropTypes.number,
  callback: PropTypes.func,
  selected: PropTypes.array,
  selectedMarker: PropTypes.element,
  backgroundColor: PropTypes.string,
  emptyText: PropTypes.string,
  emptyTextStyle: Text.propTypes.style,
  loader: PropTypes.node,
};

CameraRollPicker.defaultProps = {
  initialNumToRender: 5,
  groupTypes: 'All',
  maximum: 15,
  imagesPerRow: 3,
  imageMargin: 5,
  selectSingleItem: false,
  assetType: 'All',
  backgroundColor: 'white',
  selected: [],
  callback(selectedImages, currentImage) {
    Log(currentImage);
    Log(selectedImages);
  },
  emptyText: 'No photos.',
};

export default CameraRollPicker;
