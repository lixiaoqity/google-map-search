import React from 'react';
import { Table, Button, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { deleteAction } from '../action';

const columns = [
    {
      title: 'Address',
      dataIndex: 'name',
    },
    {
      title: 'Visited Date',
      dataIndex: 'visitedDate',
    }
  ];

class LocationHistory extends React.Component {
  state = {
    selectedRowKeys: [], 
    loading: false,
  };

  deleteLocations = () => {
    this.props.sendAction(deleteAction("delete", this.state.selectedRowKeys));
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Row>
            <Col style={{padding: "1rem"}} span={6} offset={1}>
              <h3><Link to="/">Return</Link></h3>
            </Col>
        </Row>
        <Row>
            <Col span={22} offset={1}>
              <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.deleteLocations} disabled={!hasSelected} loading={loading}>
                  Delete
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.locations} />
            </Col>
        </Row>

      </div>
    );
  }
}

const mapDispatchToPropsOut = dispatch => {
  return {
    sendAction: (action) => {
      dispatch(action);
    }
  }
}

const mapDispatchToPropsIn = state => {
  return state;
}

export default connect(mapDispatchToPropsIn, mapDispatchToPropsOut)(LocationHistory);