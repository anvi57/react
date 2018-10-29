import React from 'react';
import { Keyboard } from 'react-native';
import { Form, Item, Input, DatePicker, Text, Button, Title, Icon, Picker, View, Container, Header, Content } from 'native-base';

export default class CreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isLoading: true,
      locale: 'Тула',
      localeId: null,
      dateFrom: null,
      dateTo: null,
      events: [],
      tags: [{ id: 1, name: 'Музыка', icon: 'musical-notes', isChecked: false, tagId: '29' },
      { id: 2, name: 'Выставки', icon: 'color-palette', isChecked: false, tagId: '' },
      { id: 3, name: 'Литература', icon: 'ios-book', isChecked: false, tagId: '28' },
      { id: 4, name: 'Искусcтво', icon: 'brush', isChecked: false, tagId: '122' },
      { id: 5, name: 'Спорт', icon: 'basketball', isChecked: false, tagId: '' },
      { id: 6, name: 'Театр', icon: 'bowtie', isChecked: false, tagId: '' },
      { id: 7, name: 'Квесты', icon: 'search', isChecked: false, tagId: '217' },
      { id: 8, name: 'Музеи', icon: 'md-planet', isChecked: false, tagId: '' },
      { id: 9, name: 'Творчество', icon: 'ios-cut', isChecked: false, tagId: '118,191' },
      { id: 10, name: 'Для детей', icon: 'md-happy', isChecked: false, tagId: '39' },
      { id: 11, name: 'Кино', icon: 'videocam', isChecked: false, tagId: '164' },
      { id: 12, name: 'Фото', icon: 'images', isChecked: false, tagId: '50' },]
    };
    this.setLocale = this.setLocale.bind(this);
    this.setDateFrom = this.setDateFrom.bind(this);
    this.setDateTo = this.setDateTo.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getLocaleId = this.getLocaleId.bind(this);
  }

  setLocale(value) {
    this.setState({
      locale: value
    });
  }

  setDateFrom(newDate) {
    Keyboard.dismiss();
    this.setState({ dateFrom: newDate });
  }

  setDateTo(newDate) {
    Keyboard.dismiss();
    this.setState({ dateTo: newDate });
  }

  getLocaleId() {
    const it = this;
    url = 'https://all.culture.ru/api/2.2/locales?nameQuery=' + this.state.locale;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        it.setState({
          localeId: result.locales[0]._id
        });
      })
      .catch(alert);
  }

  setTag(id) {
    let newTags = [...this.state.tags];
    let index = newTags.findIndex(el => el.id === id);
    newTags[index].isChecked = !newTags[index].isChecked;
    this.setState({ tags: newTags });
  }

  onSubmit() {
    var tagsString = '';
    this.state.tags.forEach(tag => {
      if (tag.isChecked && tag.tagId) tagsString += tag.tagId + ',';
    });
    tagsString = tagsString.slice(0, -1);
    const it = this;
    url = 'https://all.culture.ru/api/2.2/events?status=accepted&start=' + this.state.dateFrom.getTime() + '&locales=' + this.state.localeId + '&end=' + this.state.dateTo.getTime();
    if (tagsString) url += '&tags=' + tagsString;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        it.setState({
          events: result.events,
          isLoading: false
        });
        it.props.navigation.navigate('EventsList', { events: it.state.events });
      })
      .catch(alert);
  }

  render() {
    var randomColor = require('randomcolor');
    currentDate = Date.now();
    return (
      <Container>
        <Content>
          <Form style={{ margin: 15 }}>
            <Text>Выберите место</Text>
            <Item>
              <Input
                placeholder="город"
                placeHolderStyle={{ color: "#d3d3d3" }}
                onChangeText={this.setLocale}
                onBlur={this.getLocaleId}
              ></Input>
            </Item>
            <Text>Выберите время</Text>
            <Item last>
              <DatePicker
                primary
                defaultDate={currentDate}
                minimumDate={currentDate}
                locale={"ru"}
                placeHolderText="Начало поездки"
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={this.setDateFrom}
              />
              <Text>-</Text>
              <DatePicker
                locale={"ru"}
                defaultDate={this.state.dateFrom ? this.state.dateFrom : null}
                minimumDate={this.state.dateFrom ? this.state.dateFrom : null}
                placeHolderText="Конец поездки"
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={this.setDateTo}
              />
            </Item>
            <Text>Расскажите о своих интересах</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
              {this.state.tags.map((tag) => (<View style={{ alignItems: 'center' }} key={tag.id}>
                <Button rounded large
                  style={{ width: 60, height: 60, margin: 5, justifyContent: 'center', backgroundColor: randomColor({ luminosity: 'bright', seed: tag.name }) }}
                  onPress={this.setTag.bind(this, tag.id)}>
                  <Icon name={tag.isChecked ? 'md-checkmark-circle' : tag.icon} style={{ fontSize: 30 }} />
                </Button>
                <Text style={{ fontSize: 12 }} >{tag.name}</Text>
              </View>))}
            </View>
            <Button onPress={this.onSubmit} style={{ alignSelf: 'center', marginTop: 10 }}>
              <Text>Поиск мероприятий</Text>
            </Button>
          </Form>
        </Content>
      </Container>)
  }
};