import { CaretDownFilled, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row } from 'antd'
import * as constants from '@ethersproject/constants'
import { PlusOutlined } from '@ant-design/icons'

import { FormInstance } from 'antd/lib/form/Form'

import { useState } from 'react'

import { EditTrackedAssetsForm } from './V2BalancesModal'

export type AssetInputType = 'project' | 'erc20'

const AssetTypeSwitcherButton = ({
  type,
  onClick,
}: {
  type?: AssetInputType
  onClick: VoidFunction
}) => {
  const formattedType = type === 'project' ? 'Project' : 'ERC-20'
  return (
    <Button
      style={{ marginRight: 20, width: 100 }}
      type="text"
      icon={<CaretDownFilled />}
      onClick={onClick}
    >
      {formattedType}
    </Button>
  )
}

const AssetInput = ({
  value,
  onChange,
}: {
  value?: { input?: string; type?: AssetInputType }
  onChange?: (props: { input: string; type: AssetInputType }) => void
}) => {
  const [input, setInput] = useState<string>(value?.input ?? '')
  const [type, setType] = useState<AssetInputType>(value?.type ?? 'erc20')

  const triggerChange = (changedValue: {
    input?: string
    type?: AssetInputType
  }) => {
    onChange?.({
      input,
      type,
      ...value,
      ...changedValue,
    })
  }
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(input)
    triggerChange({
      input: e.target.value,
    })
  }
  const onTypeChange = (newType: AssetInputType) => {
    setType(newType)
    triggerChange({ type: newType, input: '' })
  }

  return (
    <div style={{ display: 'inline-flex', width: '100%' }}>
      <AssetTypeSwitcherButton
        type={value?.type ?? type}
        onClick={() => {
          const toggleType = (type: AssetInputType) =>
            type === 'erc20' ? 'project' : 'erc20'
          if (value?.type) {
            onTypeChange(toggleType(value.type))
          } else {
            onTypeChange(toggleType(type))
          }
        }}
      />
      <Input
        type="text"
        placeholder={
          (value?.type ?? type) === 'erc20'
            ? constants.AddressZero
            : 'Project ID'
        }
        value={value?.input ?? input}
        onChange={onInputChange}
      />
    </div>
  )
}

export default function V2TokenRefs({
  form,
}: {
  form: FormInstance<EditTrackedAssetsForm>
}) {
  return (
    <Form form={form}>
      <Form.List name="tokenRefs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <Row key={key}>
                <Col flex="auto">
                  <Form.Item
                    name={[name, 'assetInput']}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value?.input.length) {
                            return Promise.reject('Value is ')
                          }
                          return Promise.resolve()
                        },
                        validateTrigger: 'onCreate',
                        message: 'Value is required',
                        required: true,
                      },
                    ]}
                  >
                    <AssetInput />
                  </Form.Item>
                </Col>
                <Col flex="none">
                  <CloseCircleOutlined
                    style={{ marginLeft: 10 }}
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add token
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}
