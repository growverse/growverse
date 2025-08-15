import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto.js';
import { CreateUserUseCase } from './application/usecases/create-user.usecase.js';
import { GetUserUseCase } from './application/usecases/get-user.usecase.js';
import { UpdateUserUseCase } from './application/usecases/update-user.usecase.js';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase.js';
import { UpdateUserPreferencesUseCase } from './application/usecases/update-user-preferences.usecase.js';
import { toResponse } from './mappers/user.mapper.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly updatePrefs: UpdateUserPreferencesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'The created user' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(dto);
    return toResponse(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'The user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getById(@Param('id') id: string) {
    const user = await this.getUser.execute(id);
    if (!user) throw new NotFoundException();
    return toResponse(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ description: 'The updated user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUser.execute(id, dto);
    if (!user) throw new NotFoundException();
    return toResponse(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute(id);
    return { status: 'deleted' };
  }

  @Get(':id/preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiOkResponse({ description: 'User preferences' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getPreferences(@Param('id') id: string) {
    const user = await this.getUser.execute(id);
    if (!user) throw new NotFoundException();
    return user.snapshot.preferences;
  }

  @Patch(':id/preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiOkResponse({ description: 'Updated preferences' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    const user = await this.updatePrefs.execute(id, dto);
    if (!user) throw new NotFoundException();
    return user.snapshot.preferences;
  }
}
