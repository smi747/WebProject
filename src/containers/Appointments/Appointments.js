import React, { Component } from 'react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Moment from 'react-moment'
import { map, filter } from 'underscore'
import { Form, Button } from 'reactstrap'

import Table from '../../components/Table/Table'
import TextField from '../../components/Form/TextField/TextField'
import DateField from '../../components/Form/DateField/DateField'
import SelectField from '../../components/Form/SelectField/SelectField'
import CheckboxField from '../../components/Form/CheckboxField/CheckboxField'

import './Appointments.scss'

import Header from '../Header/Header'

import LoadAppointmentStatusesAction from '../../actions/directory/LoadAppointmentStatusesAction'

import * as appointmentListActions from '../../redux/appointment/list/appointmentListActions'

import { ReactComponent as Search } from '../../images/search.svg'
import { ReactComponent as Appointment } from '../../images/appointment.svg'

const TITLE = 'Приёмы'

const USER = 'Иванов Иван Иванович'

// маппинг состояния приложения в свойства компонента-контейнера
function mapStateToProps (state) {
    return {
        error: state.appointment.list.error,
        isFetching: state.appointment.list.isFetching,
        dataSource: state.appointment.list.dataSource,
        shouldReload: state.appointment.list.shouldReload,

        directory: state.directory
    }
}

// подключение генераторов действий к компоненту-контейнеру
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            ...bindActionCreators(appointmentListActions, dispatch)
        }
    }
}

class Appointments extends Component {

  componentDidMount() {
    this.load()
  }

  onChangeFilterField = (name, value) => {
    this.actions.changeFilterField(name, value)
  }

  onChangeFilterDateField = (name, value) => {
    this.actions.changeFilterField(name, value && value.getTime())
  }

  onSearch = () => {
    this.load()
  }

  get actions () {
    return this.props.actions
  }

  load() {
    this.actions.load({
        ...this.props.dataSource.filter.toJS()
    })
  }

  render() {

    // берём данные из состояния приложения используя свойства props
    const {
      isFetching,
      dataSource: ds,
      directory
    } = this.props

    const {  
      startDate,
      endDate,
      clientName,
      statusId,
      onlyMe,
        holderName,
        compliences
    } = ds.filter

    return (
      <div className='Appointments'>
        <Header
          title={TITLE}
          userName={USER}
          className='Appointments-Header'
          bodyClassName='Appointments-HeaderBody'
          renderIcon={() => (
            <Appointment className='Header-Icon' />
          )}
        />
        <div className='Appointments-Body'>
          <div className='Appointments-Filter'>
            <LoadAppointmentStatusesAction/>
            <Form className='Appointments-FilterForm'>
              <DateField
                hasTime
                name='startDate'
                value={startDate}
                dateFormat='dd/MM/yyyy HH:mm'
                timeFormat='HH:mm'
                placeholder='С'
                className='Appointments-FilterField'
                onChange={this.onChangeFilterDateField}
              />
              <DateField
                hasTime
                name='endDate'
                value={endDate}
                dateFormat='dd/MM/yyyy HH:mm'
                timeFormat='HH:mm'
                placeholder='По'
                className='Appointments-FilterField'
                onChange={this.onChangeFilterDateField}
              />
              <TextField
                name='clientName'
                value={clientName}
                placeholder='Клиент'
                className='Appointments-FilterField'
                onChange={this.onChangeFilterField}
              />
              <TextField
                    name='holderName'
                    value={holderName}
                    placeholder='Принимающий'
                    className='Appointments-FilterField'
                    onChange={this.onChangeFilterField}
              />
              <TextField
                    name='compliences'
                    value={compliences}
                    placeholder='Жалобы'
                    className='Appointments-FilterField'
                    onChange={this.onChangeFilterField}
               />
              <SelectField
                name='statusId'
                value={statusId}
                placeholder='Статус'
                options={[
                  { value: -1, text: '' },
                  ...map(
                    directory.appointment.status.list.dataSource.data, 
                    o => ({ value: o.id, text: o.title })
                  )
                ]}
                className='Appointments-FilterField'
                onChange={this.onChangeFilterField}
              />
              <CheckboxField
                name='onlyMe'
                label='Только я'
                value={onlyMe}
                className='Appointments-FilterField'
                onChange={this.onChangeFilterField}
              />
              <Button
                className='Appointments-SearchBtn'
                onClick={this.onSearch}>
                <Search className='Appointments-SearchBtnIcon'/>
              </Button>
            </Form>
          </div>
          <Table
              data={ds.data}
              isLoading={isFetching}
              className='AppointmentList'
              columns={[
                {
                  dataField: 'date',
                  text: 'Дата',
                  headerStyle: {
                    width: '150px'
                  },
                  formatter: (v, row) => {
                    return (
                      <Moment date={v} format='DD.MM.YYYY HH.mm' />
                    )
                  }
                },
                {
                  dataField: 'clientName',
                  text: 'Клиент',
                  headerStyle: {
                    width: '300px'
                  }
                },
                {
                  dataField: 'status',
                  text: 'Статус'
                },
                {
                  dataField: 'holderName',
                  text: 'Принимающий',
                  headerStyle: {
                    width: '300px'
                  }
                },
                {
                  dataField: 'compliences',
                  text: 'Жалобы',
                  headerStyle: {
                    width: '200px'
                  }
                },
                {
                  dataField: 'diagnosis',
                  text: 'Диагноз',
                  headerStyle: {
                    width: '200px'
                  }
                }
              ]}
            />
        </div>
      </div>
    )
  }
}

// объявляем контейнер
export default connect(mapStateToProps, mapDispatchToProps)(Appointments)